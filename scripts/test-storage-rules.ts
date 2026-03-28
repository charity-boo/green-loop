/**
 * Test script for Firebase Storage security rules
 * 
 * Tests:
 * 1. Unauthenticated access (should fail)
 * 2. Authenticated user uploading their own profile image (should succeed)
 * 3. Authenticated user trying to upload another user's profile image (should fail)
 * 4. File size limit enforcement (>10MB should fail)
 * 5. Non-image file type (should fail)
 * 6. Admin access to admin paths (would need admin role)
 * 
 * Usage:
 *   npx tsx scripts/test-storage-rules.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env then .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Point to emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase client SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Firebase Admin SDK for emulator
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
admin.initializeApp({ projectId });
const adminAuth = admin.auth();

// Helper to create test image blob
function createTestImage(sizeInMB: number = 0.1): Blob {
  const bytes = new Uint8Array(sizeInMB * 1024 * 1024);
  // Fill with random data
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return new Blob([bytes], { type: 'image/jpeg' });
}

// Helper to create test non-image blob
function createTestTextFile(): Blob {
  return new Blob(['test content'], { type: 'text/plain' });
}

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

async function runTests() {
  console.log('\n🧪 Starting Firebase Storage Rules Tests...\n');
  console.log('Target: Firebase Storage Emulator (127.0.0.1:9199)\n');

  try {
    // Test 1: Unauthenticated upload should fail
    console.log('--- Test 1: Unauthenticated Upload ---');
    try {
      const testRef = ref(storage, 'users/test-user-id/profile/test.jpg');
      const testBlob = createTestImage(0.1);
      await uploadBytes(testRef, testBlob);
      logTest('Unauthenticated upload', false, 'Should have been denied but succeeded');
    } catch (error: any) {
      if (error.code === 'storage/unauthorized' || error.message.includes('permission')) {
        logTest('Unauthenticated upload', true, 'Correctly denied access');
      } else {
        logTest('Unauthenticated upload', false, `Unexpected error: ${error.message}`);
      }
    }

    // Test 2: Authenticated user uploading their own profile image should succeed
    console.log('\n--- Test 2: Authenticated User Own Profile Upload ---');
    
    // Create a test user with email/password
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testPassword123!';
    
    let userId: string;
    try {
      // Try to create user with admin SDK first
      const userRecord = await adminAuth.createUser({
        email: testEmail,
        password: testPassword,
        emailVerified: true,
      });
      userId = userRecord.uid;
      console.log(`Created test user: ${userId}`);
    } catch (error: any) {
      console.log(`Could not create user via admin SDK: ${error.message}`);
      // Fall back to client SDK sign up
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      userId = userCredential.user.uid;
      console.log(`Created test user via client SDK: ${userId}`);
    }
    
    // Sign in with the test user
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log(`Signed in as: ${userId}`);

    try {
      const profileRef = ref(storage, `users/${userId}/profile/avatar.jpg`);
      const imageBlob = createTestImage(0.5); // 0.5MB - under limit
      await uploadBytes(profileRef, imageBlob);
      logTest('Own profile upload', true, 'Successfully uploaded own profile image');
      
      // Clean up
      await deleteObject(profileRef);
    } catch (error: any) {
      logTest('Own profile upload', false, `Upload failed: ${error.message}`);
    }

    // Test 3: Authenticated user trying to upload to another user's profile should fail
    console.log('\n--- Test 3: Upload to Another User Profile ---');
    try {
      const otherUserRef = ref(storage, 'users/different-user-id/profile/avatar.jpg');
      const imageBlob = createTestImage(0.5);
      await uploadBytes(otherUserRef, imageBlob);
      logTest('Other user profile upload', false, 'Should have been denied but succeeded');
    } catch (error: any) {
      if (error.code === 'storage/unauthorized' || error.message.includes('permission')) {
        logTest('Other user profile upload', true, 'Correctly denied access to other user profile');
      } else {
        logTest('Other user profile upload', false, `Unexpected error: ${error.message}`);
      }
    }

    // Test 4: File size limit - >10MB should fail
    console.log('\n--- Test 4: File Size Limit (>10MB) ---');
    try {
      const largeFileRef = ref(storage, `users/${userId}/profile/large.jpg`);
      const largeBlob = createTestImage(11); // 11MB - over limit
      await uploadBytes(largeFileRef, largeBlob);
      logTest('Large file upload', false, 'Should have been denied due to size but succeeded');
    } catch (error: any) {
      if (error.code === 'storage/unauthorized' || error.message.includes('permission')) {
        logTest('Large file upload', true, 'Correctly denied large file (>10MB)');
      } else {
        logTest('Large file upload', false, `Unexpected error: ${error.message}`);
      }
    }

    // Test 5: Non-image file type should fail
    console.log('\n--- Test 5: Non-Image File Type ---');
    try {
      const textFileRef = ref(storage, `users/${userId}/profile/document.txt`);
      const textBlob = createTestTextFile();
      await uploadBytes(textFileRef, textBlob);
      logTest('Non-image upload', false, 'Should have been denied due to file type but succeeded');
    } catch (error: any) {
      if (error.code === 'storage/unauthorized' || error.message.includes('permission')) {
        logTest('Non-image upload', true, 'Correctly denied non-image file type');
      } else {
        logTest('Non-image upload', false, `Unexpected error: ${error.message}`);
      }
    }

    // Test 6: Waste images path - authenticated user can upload their own
    console.log('\n--- Test 6: Waste Images Upload ---');
    try {
      const wasteRef = ref(storage, `waste/${userId}/schedule-123/waste-photo.jpg`);
      const wasteBlob = createTestImage(0.5);
      await uploadBytes(wasteRef, wasteBlob);
      logTest('Waste image upload', true, 'Successfully uploaded waste image');
      
      // Clean up
      await deleteObject(wasteRef);
    } catch (error: any) {
      logTest('Waste image upload', false, `Upload failed: ${error.message}`);
    }

    // Test 7: Authenticated user can read their own waste images
    console.log('\n--- Test 7: Read Own Waste Images ---');
    try {
      // First upload a waste image
      const wasteRef = ref(storage, `waste/${userId}/schedule-456/read-test.jpg`);
      const wasteBlob = createTestImage(0.5);
      await uploadBytes(wasteRef, wasteBlob);
      
      // Now try to read it
      const downloadURL = await getDownloadURL(wasteRef);
      logTest('Read own waste image', true, 'Successfully read waste image URL');
      
      // Clean up
      await deleteObject(wasteRef);
    } catch (error: any) {
      logTest('Read own waste image', false, `Read failed: ${error.message}`);
    }

    // Test 8: Default path should deny all access
    console.log('\n--- Test 8: Default Path Access ---');
    try {
      const unauthorizedRef = ref(storage, 'random/unauthorized/path.jpg');
      const testBlob = createTestImage(0.1);
      await uploadBytes(unauthorizedRef, testBlob);
      logTest('Unauthorized path', false, 'Should have been denied but succeeded');
    } catch (error: any) {
      if (error.code === 'storage/unauthorized' || error.message.includes('permission')) {
        logTest('Unauthorized path', true, 'Correctly denied access to unmatched paths');
      } else {
        logTest('Unauthorized path', false, `Unexpected error: ${error.message}`);
      }
    }

    // Sign out
    await signOut(auth);
    
    // Clean up test user
    try {
      await adminAuth.deleteUser(userId);
      console.log(`\nCleaned up test user: ${userId}`);
    } catch (error: any) {
      console.log(`Note: Could not delete test user: ${error.message}`);
    }

  } catch (error: any) {
    console.error('\n❌ Test suite error:', error.message);
    process.exit(1);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (failed === 0) {
    console.log('✅ All tests passed! Storage rules are working correctly.\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the storage rules.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
