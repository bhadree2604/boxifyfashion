import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import { db, isFirebaseConfigured } from './firebase';
import { products as staticProducts } from './products';

const COLLECTION_NAME = 'products';

/**
 * Seed Firestore with the static product catalog if the collection is empty.
 * This runs automatically on the first successful fetchProducts() call.
 */
let hasSeeded = false;
async function seedIfEmpty() {
  if (hasSeeded) return;
  console.warn('Firestore products collection is empty — seeding from static catalog...');
  try {
    for (const item of staticProducts) {
      const payload = {
        name: String(item.name || ''),
        category: String(item.category || 'Casual Pants'),
        article: String(item.article || ''),
        sku: String(item.sku || ''),
        fabric: String(item.fabric || ''),
        price: Number(item.price) || 0,
        image: String(item.image || ''),
        images: Array.isArray(item.images) ? item.images.map(String) : [],
        description: String(item.description || ''),
        inStock: item.inStock !== undefined ? Boolean(item.inStock) : true,
        colors: Array.isArray(item.colors) ? item.colors.map(String) : [],
        sizes: Array.isArray(item.sizes) ? item.sizes.map(String) : [],
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, COLLECTION_NAME), payload);
    }
    hasSeeded = true;
    console.warn('Seeding complete. Reloading product list...');
  } catch (err) {
    console.error('Failed to auto-seed products:', err);
  }
}

/**
 * Fetch all products.
 * Tries Firestore first. If Firebase is unconfigured or fetch fails, falls back to static products array.
 */
export async function fetchProducts() {
  if (!isFirebaseConfigured || !db) {
    return staticProducts;
  }

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q;
    try {
      q = query(productsRef, orderBy('createdAt', 'desc'));
    } catch (_) {
      q = productsRef;
    }
    const snapshot = await getDocs(q);

    // If Firestore collection is empty, auto-seed from static catalog
    if (snapshot.empty) {
      if (!hasSeeded) {
        await seedIfEmpty();
        // Re-fetch after seeding
        const retrySnap = await getDocs(q);
        if (retrySnap.empty) {
          return staticProducts;
        }
        const retryItems = retrySnap.docs.map((d) => {
          const data = d.data();
          return {
            id: String(d.id),
            name: data.name || '',
            category: data.category || 'Casual Pants',
            article: data.article || '',
            sku: data.sku || '',
            fabric: data.fabric || '',
            price: Number(data.price) || 0,
            image: data.images && data.images.length > 0 ? data.images[0] : (data.image || '/images/art-201.jpeg'),
            images: Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : [data.image || '/images/art-201.jpeg'],
            description: data.description || '',
            inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
            colors: Array.isArray(data.colors) ? data.colors : [],
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            createdAt: data.createdAt ? (data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt) : Date.now(),
          };
        });
        return retryItems;
      }
      // Already seeded but still empty — fall back to static
      return staticProducts;
    }

    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: String(d.id),
        name: data.name || '',
        category: data.category || 'Casual Pants',
        article: data.article || '',
        sku: data.sku || '',
        fabric: data.fabric || '',
        price: Number(data.price) || 0,
        image: data.images && data.images.length > 0 ? data.images[0] : (data.image || '/images/art-201.jpeg'),
        images: Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : [data.image || '/images/art-201.jpeg'],
        description: data.description || '',
        inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
        colors: Array.isArray(data.colors) ? data.colors : [],
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        createdAt: data.createdAt ? (data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt) : Date.now(),
      };
    });

    return items;
  } catch (err) {
    console.warn('Firestore fetch error, using static fallback:', err);
    return staticProducts;
  }
}

/**
 * Add a new product to Firestore
 */
export async function addProduct(productData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Please set your credentials in .env.local');
  }

  const colors = Array.isArray(productData.colors)
    ? productData.colors.map((c) => String(c || '')).filter(Boolean)
    : [];
  const sizes = Array.isArray(productData.sizes)
    ? productData.sizes.map((s) => String(s || '')).filter(Boolean)
    : [];
  const images = Array.isArray(productData.images)
    ? productData.images.map((i) => String(i || '')).filter(Boolean)
    : [];

  const payload = {
    name: String(productData.name || ''),
    category: String(productData.category || 'Casual Pants'),
    article: String(productData.article || ''),
    sku: String(productData.sku || ''),
    fabric: String(productData.fabric || ''),
    price: Number(productData.price) || 0,
    description: String(productData.description || ''),
    inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
    colors,
    sizes,
    images,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return { id: String(docRef.id), ...payload };
}

/**
 * Update an existing product document in Firestore
 */
export async function updateProduct(id, productData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }
  const safeId = String(id || '');
  if (!safeId || safeId === 'undefined' || safeId === 'null') {
    throw new Error('Invalid product ID for update.');
  }

  const docRef = doc(db, COLLECTION_NAME, safeId);
  const colors = Array.isArray(productData.colors)
    ? productData.colors.map((c) => String(c || '')).filter(Boolean)
    : [];
  const sizes = Array.isArray(productData.sizes)
    ? productData.sizes.map((s) => String(s || '')).filter(Boolean)
    : [];
  const images = Array.isArray(productData.images)
    ? productData.images.map((i) => String(i || '')).filter(Boolean)
    : [];

  const payload = {
    name: String(productData.name || ''),
    category: String(productData.category || 'Casual Pants'),
    article: String(productData.article || ''),
    sku: String(productData.sku || ''),
    fabric: String(productData.fabric || ''),
    price: Number(productData.price) || 0,
    description: String(productData.description || ''),
    inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
    colors,
    sizes,
    images,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
  return { id: safeId, ...payload };
}

/**
 * Delete a product document from Firestore
 */
export async function deleteProduct(id) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const safeId = String(id || '');
  if (!safeId || safeId === 'undefined' || safeId === 'null') {
    throw new Error('Invalid product ID for deletion.');
  }

  const docRef = doc(db, COLLECTION_NAME, safeId);
  await deleteDoc(docRef);
  return safeId;
}

/**
 * Compress an image file client-side and upload to Cloudinary via /api/upload-image.
 * Returns the secure Cloudinary image URL.
 */
export async function uploadProductImage(file, productId = 'general') {
  let fileToUpload = file;
  try {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };
    fileToUpload = await imageCompression(file, options);
  } catch (compErr) {
    console.warn('Image compression skipped/failed, uploading original:', compErr);
  }

  const formData = new FormData();
  formData.append('file', fileToUpload, file.name);
  formData.append('productId', productId);

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Failed to upload image to Cloudinary.');
  }

  return data.url;
}
