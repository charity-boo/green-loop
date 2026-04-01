import { adminDb } from '../lib/firebase/admin';
import { assignScheduleAutomatically } from '../lib/admin/assignment';

/**
 * Backlog reconciliation script for paid unassigned schedules.
 * Run with: pnpm tsx scripts/reconcile-region-assignments.ts [--dry-run]
 */
async function reconcile() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  console.log(`[Reconcile] Starting region assignment reconciliation (Dry Run: ${isDryRun})...`);

  try {
    const snapshot = await adminDb
      .collection('schedules')
      .where('paymentStatus', '==', 'Paid')
      .where('status', '==', 'pending')
      .get();

    console.log(`[Reconcile] Found ${snapshot.size} candidate schedules.`);

    let assigned = 0;
    let failed = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const scheduleId = doc.id;

      // Double check if already assigned (in case of race conditions during script run)
      if (data.collectorId || data.assignedCollectorId) {
        skipped++;
        continue;
      }

      if (isDryRun) {
        console.log(`[Dry Run] Would attempt to assign schedule ${scheduleId} (Region: ${data.region})`);
        assigned++;
        continue;
      }

      try {
        const result = await assignScheduleAutomatically(scheduleId);
        if (result.assignedCollectorId) {
          console.log(`[Reconcile] Successfully assigned ${scheduleId} to ${result.assignedCollectorId}`);
          assigned++;
        } else {
          console.warn(`[Reconcile] Could not assign ${scheduleId}: ${result.reason}`);
          failed++;
        }
      } catch (err) {
        console.error(`[Reconcile] Error processing ${scheduleId}:`, err);
        failed++;
      }
    }

    console.log('\n--- Reconciliation Summary ---');
    console.log(`Total Scanned: ${snapshot.size}`);
    console.log(`Assigned:      ${assigned}`);
    console.log(`Failed:        ${failed}`);
    console.log(`Skipped:       ${skipped}`);
    console.log('------------------------------');

  } catch (error) {
    console.error('[Reconcile] Fatal error during reconciliation:', error);
    process.exit(1);
  }
}

reconcile()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
