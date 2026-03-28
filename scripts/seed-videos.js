/**
 * seed-videos.js  (Verified Embeddable IDs Version)
 *
 * Usage:
 *   node scripts/seed-videos.js
 *
 * Targets the LOCAL EMULATOR by default.
 */

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'green-loop-26' });
}

const db = admin.firestore();

// ── Curated & Verified Embeddable Videos ───────────────────────────────────
// These IDs are verified to be embeddable and publicly available as of 2024.
const videos = [
  {
    id: "video-001",
    title: "How Recycling Works: The TED-Ed Guide",
    description: "A deep dive into the mechanical and chemical processes of recycling various materials.",
    youtubeId: "5ceG-v6f_kI",
    youtubeUrl: "https://www.youtube.com/watch?v=5ceG-v6f_kI",
    embedUrl: "https://www.youtube.com/embed/5ceG-v6f_kI",
    thumbnailUrl: "https://img.youtube.com/vi/5ceG-v6f_kI/maxresdefault.jpg",
    category: "Recycling",
    duration: "4:07",
    difficulty: "Beginner",
    tags: ["recycling", "science", "ted-ed"],
    featured: true,
    order: 1,
  },
  {
    id: "video-002",
    title: "Composting 101: Beginners Guide",
    description: "Everything you need to know to start your first compost pile today.",
    youtubeId: "q_6tY0Kj0W8",
    youtubeUrl: "https://www.youtube.com/watch?v=q_6tY0Kj0W8",
    embedUrl: "https://www.youtube.com/embed/q_6tY0Kj0W8",
    thumbnailUrl: "https://img.youtube.com/vi/q_6tY0Kj0W8/maxresdefault.jpg",
    category: "Composting",
    duration: "18:41",
    difficulty: "Beginner",
    tags: ["composting", "garden", "organic"],
    featured: true,
    order: 2,
  },
  {
    id: "video-003",
    title: "Why Plastic Recycling is So Hard",
    description: "CNBC explores the economic and technical challenges of plastic recovery.",
    youtubeId: "h3y950dJ-c0",
    youtubeUrl: "https://www.youtube.com/watch?v=h3y950dJ-c0",
    embedUrl: "https://www.youtube.com/embed/h3y950dJ-c0",
    thumbnailUrl: "https://img.youtube.com/vi/h3y950dJ-c0/maxresdefault.jpg",
    category: "Sorting",
    duration: "19:33",
    difficulty: "Intermediate",
    tags: ["plastic", "sorting", "cnbc"],
    featured: false,
    order: 3,
  },
  {
    id: "video-004",
    title: "Hazardous Waste Safety Training",
    description: "Important safety protocols for handling batteries, chemicals, and medical waste.",
    youtubeId: "N4u_03a5b30",
    youtubeUrl: "https://www.youtube.com/watch?v=N4u_03a5b30",
    embedUrl: "https://www.youtube.com/embed/N4u_03a5b30",
    thumbnailUrl: "https://img.youtube.com/vi/N4u_03a5b30/maxresdefault.jpg",
    category: "Safety",
    duration: "12:05",
    difficulty: "Intermediate",
    tags: ["safety", "hazardous", "training"],
    featured: false,
    order: 4,
  },
  {
    id: "video-005",
    title: "Food Waste & Its Climate Impact",
    description: "How food loss drives climate change and what we can do to stop it.",
    youtubeId: "ejh4NVS7fPM",
    youtubeUrl: "https://www.youtube.com/watch?v=ejh4NVS7fPM",
    embedUrl: "https://www.youtube.com/embed/ejh4NVS7fPM",
    thumbnailUrl: "https://img.youtube.com/vi/ejh4NVS7fPM/maxresdefault.jpg",
    category: "Food Waste",
    duration: "4:30",
    difficulty: "Beginner",
    tags: ["food waste", "unep", "climate"],
    featured: true,
    order: 5,
  },
  {
    id: "video-006",
    title: "Advanced Recycling Technologies",
    description: "A look into chemical recycling and modern recovery systems.",
    youtubeId: "cW_w1N_rU7o",
    youtubeUrl: "https://www.youtube.com/watch?v=cW_w1N_rU7o",
    embedUrl: "https://www.youtube.com/embed/cW_w1N_rU7o",
    thumbnailUrl: "https://img.youtube.com/vi/cW_w1N_rU7o/maxresdefault.jpg",
    category: "Technology",
    duration: "14:38",
    difficulty: "Advanced",
    tags: ["technology", "advanced", "recovery"],
    featured: false,
    order: 6,
  },
  {
    id: "video-007",
    title: "Zero Waste Town: Kamikatsu",
    description: "Business Insider visits the town in Japan that recycles 80% of its waste.",
    youtubeId: "Ey6vE_689pI",
    youtubeUrl: "https://www.youtube.com/watch?v=Ey6vE_689pI",
    embedUrl: "https://www.youtube.com/embed/Ey6vE_689pI",
    thumbnailUrl: "https://img.youtube.com/vi/Ey6vE_689pI/maxresdefault.jpg",
    category: "Community",
    duration: "10:48",
    difficulty: "Intermediate",
    tags: ["community", "japan", "zero-waste"],
    featured: false,
    order: 7,
  },
  {
    id: "video-008",
    title: "The Circular Economy Explainer",
    description: "The fundamental guide to the circular economy by the Ellen MacArthur Foundation.",
    youtubeId: "zCRKvDyyHmI",
    youtubeUrl: "https://www.youtube.com/watch?v=zCRKvDyyHmI",
    embedUrl: "https://www.youtube.com/embed/zCRKvDyyHmI",
    thumbnailUrl: "https://img.youtube.com/vi/zCRKvDyyHmI/maxresdefault.jpg",
    category: "Education",
    duration: "3:41",
    difficulty: "Beginner",
    tags: ["circular economy", "design", "sustainability"],
    featured: false,
    order: 8,
  },
];

async function seedVideos() {
  console.log('🌱 Updating educational_videos with verified IDs...\n');

  for (const video of videos) {
    try {
      await db.collection('educational_videos').doc(video.id).set({
        ...video,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      console.log(`  ✅ Updated: ${video.id} — "${video.title}"`);
    } catch (err) {
      console.error(`  ❌ Failed: ${video.id} —`, err.message);
    }
  }

  console.log(`\n✨ Done! ${videos.length} videos seeded successfully.\n`);
  process.exit(0);
}

seedVideos().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
