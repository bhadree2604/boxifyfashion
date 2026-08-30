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

    if (snapshot.empty) {
      // If collection is empty, return static products as fallback
      return staticProducts;
    }

    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
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

  const payload = {
    name: productData.name || '',
    category: productData.category || 'Casual Pants',
    article: productData.article || '',
    sku: productData.sku || '',
    fabric: productData.fabric || '',
    price: Number(productData.price) || 0,
    description: productData.description || '',
    inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
    colors: Array.isArray(productData.colors) ? productData.colors : [],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
    images: Array.isArray(productData.images) ? productData.images : [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return { id: docRef.id, ...payload };
}

/**
 * Update an existing product document in Firestore
 */
export async function updateProduct(id, productData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    name: productData.name || '',
    category: productData.category || 'Casual Pants',
    article: productData.article || '',
    sku: productData.sku || '',
    fabric: productData.fabric || '',
    price: Number(productData.price) || 0,
    description: productData.description || '',
    inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
    colors: Array.isArray(productData.colors) ? productData.colors : [],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
    images: Array.isArray(productData.images) ? productData.images : [],
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
  return { id, ...payload };
}

/**
 * Delete a product document from Firestore
 */
export async function deleteProduct(id) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
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
