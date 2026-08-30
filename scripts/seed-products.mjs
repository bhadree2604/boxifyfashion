import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { products } from '../lib/products.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
  console.error('❌ Error: Firebase credentials are not set in .env.local!');
  console.error('Please update .env.local with your real Firebase config values before running the seed script.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('🌱 Starting product seeding into Firestore collection "products"...');
  try {
    for (const item of products) {
      const payload = {
        name: item.name,
        category: item.category,
        article: item.article,
        sku: item.sku,
        fabric: item.fabric,
        price: item.price,
        image: item.image,
        images: item.images,
        description: item.description,
        inStock: item.inStock,
        colors: item.colors,
        sizes: item.sizes,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'products'), payload);
      console.log(`  ✅ Added "${item.name}" (ID: ${docRef.id})`);
    }
    console.log('🎉 Seeding complete! All initial products are now live in your Firestore database.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

seed();
