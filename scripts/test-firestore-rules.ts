#!/usr/bin/env tsx
/**
 * Firestore Security Rules Test Suite
 * 
 * Tests all security rules to ensure:
 * 1. Users cannot read other users' profiles
 * 2. Users cannot update other users' waste
 * 3. Users cannot list all notifications
 * 4. Users cannot set own role to ADMIN
 * 5. Admins can access all protected resources
 * 6. Missing collections have proper security rules
 */

import { 
  initializeTestEnvironment, 
  assertFails, 
  assertSucceeds,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  getDocs,
  where,
  limit
} from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'green-loop-test';
const RULES_PATH = path.join(__dirname, '../firebase/rules/firestore.rules');

let testEnv: RulesTestEnvironment;

// Test user IDs
const USER1_ID = 'user1';
const USER2_ID = 'user2';
const COLLECTOR_ID = 'collector1';
const ADMIN_ID = 'admin1';

interface TestResult {
  category: string;
  test: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function recordResult(category: string, test: string, passed: boolean, error?: string) {
  results.push({ category, test, passed, error });
  const status = passed ? '✓' : '✗';
  const message = passed ? test : `${test} - ${error}`;
  console.log(`  ${status} ${message}`);
}

async function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...\n');
  
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(RULES_PATH, 'utf8'),
      host: 'localhost',
      port: 8080
    }
  });

  // Create test users in the database
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    
    // Create user documents
    await setDoc(doc(db, 'users', USER1_ID), {
      email: 'user1@example.com',
      role: 'USER',
      name: 'Test User 1',
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'users', USER2_ID), {
      email: 'user2@example.com',
      role: 'USER',
      name: 'Test User 2',
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'users', COLLECTOR_ID), {
      email: 'collector@example.com',
      role: 'COLLECTOR',
      name: 'Test Collector',
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'users', ADMIN_ID), {
      email: 'admin@example.com',
      role: 'ADMIN',
      name: 'Test Admin',
      createdAt: new Date().toISOString()
    });

    // Create test waste documents
    await setDoc(doc(db, 'waste', 'waste1'), {
      userId: USER1_ID,
      type: 'plastic',
      weight: 5,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'waste', 'waste2'), {
      userId: USER2_ID,
      collectorId: COLLECTOR_ID,
      type: 'glass',
      weight: 3,
      status: 'collected',
      createdAt: new Date().toISOString()
    });

    // Create test notifications
    await setDoc(doc(db, 'notifications', 'notif1'), {
      userId: USER1_ID,
      message: 'Your waste has been collected',
      read: false,
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'notifications', 'notif2'), {
      userId: USER2_ID,
      message: 'New challenge available',
      read: false,
      createdAt: new Date().toISOString()
    });
  });
  
  console.log('✓ Test environment ready\n');
}

async function testUsersCollectionPrivacy() {
  console.log('📋 Testing Users Collection Privacy:');

  // Test 1: User cannot read other user's profile
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(getDoc(doc(user1Context.firestore(), 'users', USER2_ID)));
    recordResult('Users', 'User cannot read other user profile', true);
  } catch (e: any) {
    recordResult('Users', 'User cannot read other user profile', false, e.message);
  }

  // Test 2: User can read own profile
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'users', USER1_ID)));
    recordResult('Users', 'User can read own profile', true);
  } catch (e: any) {
    recordResult('Users', 'User can read own profile', false, e.message);
  }

  // Test 3: Admin can read any user profile
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'users', USER1_ID)));
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'users', USER2_ID)));
    recordResult('Users', 'Admin can read any user profile', true);
  } catch (e: any) {
    recordResult('Users', 'Admin can read any user profile', false, e.message);
  }

  // Test 4: User cannot set own role to ADMIN
  try {
    const user1Context = testEnv.authenticatedContext('newuser1');
    await assertFails(setDoc(doc(user1Context.firestore(), 'users', 'newuser1'), {
      email: 'newuser@example.com',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    }));
    recordResult('Users', 'User cannot set own role to ADMIN on create', true);
  } catch (e: any) {
    recordResult('Users', 'User cannot set own role to ADMIN on create', false, e.message);
  }

  // Test 5: User cannot update own role
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(updateDoc(doc(user1Context.firestore(), 'users', USER1_ID), {
      role: 'ADMIN'
    }));
    recordResult('Users', 'User cannot update own role', true);
  } catch (e: any) {
    recordResult('Users', 'User cannot update own role', false, e.message);
  }

  // Test 6: User cannot update own email
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(updateDoc(doc(user1Context.firestore(), 'users', USER1_ID), {
      email: 'hacker@example.com'
    }));
    recordResult('Users', 'User cannot update own email', true);
  } catch (e: any) {
    recordResult('Users', 'User cannot update own email', false, e.message);
  }

  // Test 7: User can update own non-protected fields
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(updateDoc(doc(user1Context.firestore(), 'users', USER1_ID), {
      name: 'Updated Name'
    }));
    recordResult('Users', 'User can update own non-protected fields', true);
  } catch (e: any) {
    recordResult('Users', 'User can update own non-protected fields', false, e.message);
  }

  console.log('');
}

async function testWasteCollectionAuthorization() {
  console.log('📋 Testing Waste Collection Authorization:');

  // Test 1: User cannot read other user's waste
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(getDoc(doc(user1Context.firestore(), 'waste', 'waste2')));
    recordResult('Waste', 'User cannot read other user waste', true);
  } catch (e: any) {
    recordResult('Waste', 'User cannot read other user waste', false, e.message);
  }

  // Test 2: User can read own waste
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'waste', 'waste1')));
    recordResult('Waste', 'User can read own waste', true);
  } catch (e: any) {
    recordResult('Waste', 'User can read own waste', false, e.message);
  }

  // Test 3: Collector can read assigned waste
  try {
    const collectorContext = testEnv.authenticatedContext(COLLECTOR_ID);
    await assertSucceeds(getDoc(doc(collectorContext.firestore(), 'waste', 'waste2')));
    recordResult('Waste', 'Collector can read assigned waste', true);
  } catch (e: any) {
    recordResult('Waste', 'Collector can read assigned waste', false, e.message);
  }

  // Test 4: User cannot update other user's waste
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(updateDoc(doc(user1Context.firestore(), 'waste', 'waste2'), {
      status: 'collected'
    }));
    recordResult('Waste', 'User cannot update other user waste', true);
  } catch (e: any) {
    recordResult('Waste', 'User cannot update other user waste', false, e.message);
  }

  // Test 5: User can create waste with own userId
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(setDoc(doc(user1Context.firestore(), 'waste', 'waste-new1'), {
      userId: USER1_ID,
      type: 'paper',
      weight: 2,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));
    recordResult('Waste', 'User can create waste with own userId', true);
  } catch (e: any) {
    recordResult('Waste', 'User can create waste with own userId', false, e.message);
  }

  // Test 6: User cannot create waste for another user
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(setDoc(doc(user1Context.firestore(), 'waste', 'waste-hack'), {
      userId: USER2_ID,
      type: 'paper',
      weight: 2,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));
    recordResult('Waste', 'User cannot create waste for another user', true);
  } catch (e: any) {
    recordResult('Waste', 'User cannot create waste for another user', false, e.message);
  }

  // Test 7: Admin can update any waste
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(updateDoc(doc(adminContext.firestore(), 'waste', 'waste1'), {
      status: 'verified'
    }));
    recordResult('Waste', 'Admin can update any waste', true);
  } catch (e: any) {
    recordResult('Waste', 'Admin can update any waste', false, e.message);
  }

  console.log('');
}

async function testNotificationsDataLeak() {
  console.log('📋 Testing Notifications Data Leak Prevention:');

  // Test 1: User cannot list all notifications
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    const q = query(collection(user1Context.firestore(), 'notifications'));
    await assertFails(getDocs(q));
    recordResult('Notifications', 'User cannot list all notifications without filter', true);
  } catch (e: any) {
    recordResult('Notifications', 'User cannot list all notifications without filter', false, e.message);
  }

  // Test 2: User cannot read other user's notification
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(getDoc(doc(user1Context.firestore(), 'notifications', 'notif2')));
    recordResult('Notifications', 'User cannot read other user notification', true);
  } catch (e: any) {
    recordResult('Notifications', 'User cannot read other user notification', false, e.message);
  }

  // Test 3: User can read own notification
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'notifications', 'notif1')));
    recordResult('Notifications', 'User can read own notification', true);
  } catch (e: any) {
    recordResult('Notifications', 'User can read own notification', false, e.message);
  }

  // Test 4: User can update own notification (mark as read)
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(updateDoc(doc(user1Context.firestore(), 'notifications', 'notif1'), {
      read: true,
      readAt: new Date().toISOString()
    }));
    recordResult('Notifications', 'User can mark own notification as read', true);
  } catch (e: any) {
    recordResult('Notifications', 'User can mark own notification as read', false, e.message);
  }

  // Test 5: User cannot update other fields in notification
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(updateDoc(doc(user1Context.firestore(), 'notifications', 'notif1'), {
      message: 'Hacked message'
    }));
    recordResult('Notifications', 'User cannot update notification message', true);
  } catch (e: any) {
    recordResult('Notifications', 'User cannot update notification message', false, e.message);
  }

  // Test 6: Only admin can create notifications
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(setDoc(doc(user1Context.firestore(), 'notifications', 'notif-new'), {
      userId: USER1_ID,
      message: 'Self-created notification',
      read: false,
      createdAt: new Date().toISOString()
    }));
    recordResult('Notifications', 'User cannot create notifications', true);
  } catch (e: any) {
    recordResult('Notifications', 'User cannot create notifications', false, e.message);
  }

  // Test 7: Admin can create notifications
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(setDoc(doc(adminContext.firestore(), 'notifications', 'notif-admin'), {
      userId: USER1_ID,
      message: 'Admin notification',
      read: false,
      createdAt: new Date().toISOString()
    }));
    recordResult('Notifications', 'Admin can create notifications', true);
  } catch (e: any) {
    recordResult('Notifications', 'Admin can create notifications', false, e.message);
  }

  console.log('');
}

async function testMissingCollectionsSecurity() {
  console.log('📋 Testing Missing Collections Security:');

  // Setup test data
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    
    await setDoc(doc(db, 'challenges', 'challenge1'), {
      title: 'Test Challenge',
      points: 100
    });

    await setDoc(doc(db, 'events', 'event1'), {
      title: 'Test Event',
      date: new Date().toISOString()
    });

    await setDoc(doc(db, 'greenTips', 'tip1'), {
      title: 'Test Tip',
      content: 'Save water'
    });

    await setDoc(doc(db, 'stories', 'story1'), {
      userId: USER1_ID,
      title: 'My Story',
      content: 'Test content'
    });

    await setDoc(doc(db, 'broadcasts', 'broadcast1'), {
      message: 'System announcement',
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'collectors', 'collector-profile1'), {
      userId: COLLECTOR_ID,
      vehicleType: 'truck',
      verified: true
    });

    await setDoc(doc(db, 'hostels', 'hostel1'), {
      name: 'Test Hostel',
      location: 'Test City'
    });
  });

  // Test Challenges collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'challenges', 'challenge1')));
    recordResult('Collections', 'User can read challenges', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read challenges', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(setDoc(doc(user1Context.firestore(), 'challenges', 'challenge-new'), {
      title: 'Hacked Challenge'
    }));
    recordResult('Collections', 'User cannot create challenges', true);
  } catch (e: any) {
    recordResult('Collections', 'User cannot create challenges', false, e.message);
  }

  // Test Events collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'events', 'event1')));
    recordResult('Collections', 'User can read events', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read events', false, e.message);
  }

  // Test Green Tips collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'greenTips', 'tip1')));
    recordResult('Collections', 'User can read green tips', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read green tips', false, e.message);
  }

  // Test Stories collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'stories', 'story1')));
    recordResult('Collections', 'User can read stories', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read stories', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(setDoc(doc(user1Context.firestore(), 'stories', 'story-new'), {
      userId: USER1_ID,
      title: 'New Story',
      content: 'Content'
    }));
    recordResult('Collections', 'User can create own stories', true);
  } catch (e: any) {
    recordResult('Collections', 'User can create own stories', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(updateDoc(doc(user1Context.firestore(), 'stories', 'story1'), {
      title: 'Updated Story'
    }));
    recordResult('Collections', 'User can update own stories', true);
  } catch (e: any) {
    recordResult('Collections', 'User can update own stories', false, e.message);
  }

  // Test Broadcasts collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'broadcasts', 'broadcast1')));
    recordResult('Collections', 'User can read broadcasts', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read broadcasts', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(setDoc(doc(user1Context.firestore(), 'broadcasts', 'broadcast-new'), {
      message: 'Fake broadcast'
    }));
    recordResult('Collections', 'User cannot create broadcasts', true);
  } catch (e: any) {
    recordResult('Collections', 'User cannot create broadcasts', false, e.message);
  }

  // Test Collectors collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'collectors', 'collector-profile1')));
    recordResult('Collections', 'User can read collector profiles', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read collector profiles', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(setDoc(doc(user1Context.firestore(), 'collectors', 'collector-new'), {
      userId: USER1_ID,
      vehicleType: 'bike',
      verified: false
    }));
    recordResult('Collections', 'User can create own collector profile', true);
  } catch (e: any) {
    recordResult('Collections', 'User can create own collector profile', false, e.message);
  }

  // Test Hostels collection
  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertSucceeds(getDoc(doc(user1Context.firestore(), 'hostels', 'hostel1')));
    recordResult('Collections', 'User can read hostels', true);
  } catch (e: any) {
    recordResult('Collections', 'User can read hostels', false, e.message);
  }

  try {
    const user1Context = testEnv.authenticatedContext(USER1_ID);
    await assertFails(setDoc(doc(user1Context.firestore(), 'hostels', 'hostel-new'), {
      name: 'Fake Hostel'
    }));
    recordResult('Collections', 'User cannot create hostels', true);
  } catch (e: any) {
    recordResult('Collections', 'User cannot create hostels', false, e.message);
  }

  console.log('');
}

async function testAdminAccess() {
  console.log('📋 Testing Admin Access:');

  // Test 1: Admin can access all user profiles
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'users', USER1_ID)));
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'users', USER2_ID)));
    recordResult('Admin', 'Admin can read all user profiles', true);
  } catch (e: any) {
    recordResult('Admin', 'Admin can read all user profiles', false, e.message);
  }

  // Test 2: Admin can update user roles
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(updateDoc(doc(adminContext.firestore(), 'users', USER1_ID), {
      role: 'COLLECTOR'
    }));
    recordResult('Admin', 'Admin can update user roles', true);
  } catch (e: any) {
    recordResult('Admin', 'Admin can update user roles', false, e.message);
  }

  // Test 3: Admin can access all waste documents
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'waste', 'waste1')));
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'waste', 'waste2')));
    recordResult('Admin', 'Admin can read all waste documents', true);
  } catch (e: any) {
    recordResult('Admin', 'Admin can read all waste documents', false, e.message);
  }

  // Test 4: Admin can access all notifications
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'notifications', 'notif1')));
    await assertSucceeds(getDoc(doc(adminContext.firestore(), 'notifications', 'notif2')));
    recordResult('Admin', 'Admin can read all notifications', true);
  } catch (e: any) {
    recordResult('Admin', 'Admin can read all notifications', false, e.message);
  }

  // Test 5: Admin can create/update/delete in protected collections
  try {
    const adminContext = testEnv.authenticatedContext(ADMIN_ID);
    await assertSucceeds(setDoc(doc(adminContext.firestore(), 'challenges', 'admin-challenge'), {
      title: 'Admin Challenge'
    }));
    await assertSucceeds(updateDoc(doc(adminContext.firestore(), 'challenges', 'challenge1'), {
      title: 'Updated by Admin'
    }));
    await assertSucceeds(deleteDoc(doc(adminContext.firestore(), 'challenges', 'admin-challenge')));
    recordResult('Admin', 'Admin can manage protected collections', true);
  } catch (e: any) {
    recordResult('Admin', 'Admin can manage protected collections', false, e.message);
  }

  console.log('');
}

async function printSummary() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ✗ [${r.category}] ${r.test}`);
      if (r.error) {
        console.log(`    Error: ${r.error}`);
      }
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

async function cleanup() {
  console.log('🧹 Cleaning up test environment...');
  await testEnv.cleanup();
  console.log('✓ Cleanup complete\n');
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔒 FIRESTORE SECURITY RULES TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    await setupTestEnvironment();
    await testUsersCollectionPrivacy();
    await testWasteCollectionAuthorization();
    await testNotificationsDataLeak();
    await testMissingCollectionsSecurity();
    await testAdminAccess();
    await printSummary();

    const failed = results.filter(r => !r.passed).length;
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Test suite failed with error:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run tests
main();
