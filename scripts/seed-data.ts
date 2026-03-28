import { admin, db, auth } from '../lib/firebase/admin';
import { WasteStatus } from '../types/waste-status';

const seedData = async () => {
  console.log('Starting seeding process...');

  // 1. Seed Auth Users (for emulators)
  const authUsers = [
    {
      uid: 'admin-user-id',
      email: 'admin@greenloop.com',
      password: 'password123',
      displayName: 'Admin User',
    },
    {
      uid: 'collector-user-id',
      email: 'collector@greenloop.com',
      password: 'password123',
      displayName: 'John Collector',
    },
    {
      uid: 'regular-user-id',
      email: 'jane@example.com',
      password: 'password123',
      displayName: 'Jane Doe',
    }
  ];

  for (const user of authUsers) {
    try {
      // Check if user exists first to avoid errors on re-run
      await auth.getUser(user.uid);
      console.log(`Auth user ${user.uid} already exists, updating...`);
      await auth.updateUser(user.uid, {
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(`Creating Auth user ${user.uid}...`);
        await auth.createUser(user);
      } else {
        console.error(`Error handling Auth user ${user.uid}:`, error);
      }
    }
  }

  const batch = db.batch();

  // 2. Seed Users (Firestore)
  const users = [
    {
      id: 'admin-user-id',
      name: 'Admin User',
      email: 'admin@greenloop.com',
      role: 'ADMIN',
      region: 'nairobi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'collector-user-id',
      name: 'John Collector',
      email: 'collector@greenloop.com',
      role: 'COLLECTOR',
      region: 'nairobi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'regular-user-id',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'USER',
      region: 'nairobi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  users.forEach(user => {
    const ref = db.collection('users').doc(user.id);
    batch.set(ref, user);
  });

  // 3. Seed Waste/Pickups
  const wasteItems = [
    {
      id: 'waste-1',
      userId: 'regular-user-id',
      description: 'Bag of plastic bottles',
      price: 50,
      status: WasteStatus.Completed,
      type: 'plastic',
      weight: 5.5,
      location: 'Nairobi CBD',
      assignedCollectorId: 'collector-user-id',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'waste-2',
      userId: 'regular-user-id',
      description: 'Kitchen organic waste',
      price: 0,
      status: WasteStatus.Pending,
      type: 'organic',
      location: 'Nairobi West',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  wasteItems.forEach(item => {
    const ref = db.collection('waste').doc(item.id);
    batch.set(ref, item);
  });

  // 4. Seed Hostels
  const hostels = [
    {
      id: 'hostel-1',
      name: 'Green View Hostel',
      location: 'Near University Main Gate',
      points: 1250,
      managerId: 'admin-user-id',
      studentCount: 150,
      totalWasteRecycled: 450.5,
      tier: 'premium',
      verified: true,
      pickupSchedule: {
        days: ['Mon', 'Wed', 'Fri'],
        time: '08:00 AM',
        instructions: 'Leave bins at the back entrance'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  hostels.forEach(hostel => {
    const ref = db.collection('hostels').doc(hostel.id);
    batch.set(ref, hostel);
  });

  // 5. Seed Green Tips
  const greenTips = [
    {
      id: 'tip-1',
      title: 'How to start composting at home',
      description: 'Composting is a great way to reduce waste and create nutrient-rich soil for your garden...',
      category: 'Composting',
      status: 'published',
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tip-2',
      title: 'Plastic recycling symbols explained',
      description: 'Not all plastics are created equal. Learn what the numbers inside the recycling triangle mean...',
      category: 'Recycling',
      status: 'published',
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  greenTips.forEach(tip => {
    const ref = db.collection('greenTips').doc(tip.id);
    batch.set(ref, tip);
  });

  // 6. Seed Events
  const events = [
    {
      id: 'event-1',
      title: 'Nairobi River Cleanup',
      description: 'Join us for a massive cleanup drive along the Nairobi River banks.',
      eventDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
      location: 'Museum Hill',
      category: 'Cleanup Drive',
      status: 'published',
      registrationRequired: true,
      maxParticipants: 100,
      currentParticipants: 45,
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  events.forEach(event => {
    const ref = db.collection('events').doc(event.id);
    batch.set(ref, event);
  });

  // 7. Seed Challenges
  const challenges = [
    {
      id: 'challenge-1',
      title: '30-Day Zero Waste Challenge',
      description: 'Try to produce as little landfill waste as possible for 30 days.',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      goal: 'Collect 1000kg of community recyclables',
      currentProgress: 250,
      status: 'active',
      participants: ['regular-user-id'],
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  challenges.forEach(challenge => {
    const ref = db.collection('challenges').doc(challenge.id);
    batch.set(ref, challenge);
  });

  // 8. Seed Pickup Schedules
  const pickupSchedules = [
    {
      id: 'schedule-1',
      categoryId: 'plastic',
      categoryName: 'Plastic & Bottles',
      dayOfWeek: 1, // Monday
      time: '09:00',
      region: 'nairobi',
      preparationInstructions: 'Rinse bottles and flatten them to save space.',
      active: true,
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'schedule-2',
      categoryId: 'organic',
      categoryName: 'Organic Waste',
      dayOfWeek: 3, // Wednesday
      time: '08:00',
      region: 'nairobi',
      preparationInstructions: 'Use biodegradable bags for your organic waste.',
      active: true,
      createdBy: 'admin-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  pickupSchedules.forEach(schedule => {
    const ref = db.collection('pickupSchedules').doc(schedule.id);
    batch.set(ref, schedule);
  });

  try {
    await batch.commit();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error committing batch:', error);
  }
};

seedData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed script failed:', err);
    process.exit(1);
  });
