import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Log a site visit to Firestore.
 */
export async function logSiteVisit(path) {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, 'site_visits'), {
      path,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to log site visit:', err);
  }
}

/**
 * Log a login event to Firestore.
 */
export async function logLoginEvent(email, type = 'customer') {
  if (!isFirebaseConfigured || !db) return;
  try {
    await addDoc(collection(db, 'login_events'), {
      email,
      type,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to log login event:', err);
  }
}

/**
 * Get documents from a collection within a date range.
 * Returns raw Firestore docs mapped to { id, ...data }.
 */
async function getDocsInRange(collectionName, startDate, endDate) {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const colRef = collection(db, collectionName);
    const q = query(
      colRef,
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      const ts = data.timestamp;
      const date = ts?.toDate ? ts.toDate() : (ts?.seconds ? new Date(ts.seconds * 1000) : new Date());
      return { id: d.id, ...data, _date: date };
    });
  } catch (err) {
    console.warn(`Failed to fetch ${collectionName}:`, err);
    return [];
  }
}

/**
 * Get visit counts grouped by day for a date range.
 * Returns: [{ label: 'Mon', count: 12 }, ...]
 */
export async function getVisitsByDay(startDate, endDate) {
  const docs = await getDocsInRange('site_visits', startDate, endDate);
  const counts = {};
  docs.forEach((doc) => {
    const d = doc._date;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Get login counts grouped by day for a date range.
 * Returns: [{ label: 'Mon', count: 5 }, ...]
 */
export async function getLoginsByDay(startDate, endDate) {
  const docs = await getDocsInRange('login_events', startDate, endDate);
  const counts = {};
  docs.forEach((doc) => {
    const d = doc._date;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Get total count of documents in a collection within a date range.
 */
export async function getCountInRange(collectionName, startDate, endDate) {
  const docs = await getDocsInRange(collectionName, startDate, endDate);
  return docs.length;
}

/**
 * Get today's count for a collection (since midnight local time).
 */
export async function getTodayCount(collectionName) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return getCountInRange(collectionName, startOfDay, now);
}

/**
 * Build an array of the last N days with counts filled in.
 * daysAgo = 6 means today minus 6 days through today (7 days total).
 */
export function buildDailyArray(countsMap, daysAgo = 6) {
  const result = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  for (let i = daysAgo; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    result.push({
      label: dayNames[d.getDay()],
      date: key,
      count: countsMap[key] || 0,
    });
  }
  return result;
}

/**
 * Build an array of weeks for the last N weeks with counts.
 */
export function buildWeeklyArray(countsMap, weeksAgo = 3) {
  const result = [];
  const today = new Date();
  for (let i = weeksAgo; i >= 0; i--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    let total = 0;
    for (let j = 0; j < 7; j++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + j);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      total += countsMap[key] || 0;
    }

    const startLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    const endLabel = `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    result.push({
      label: `${startLabel}-${endLabel}`,
      count: total,
    });
  }
  return result;
}

/**
 * Build monthly array for the last N months with counts.
 */
export function buildMonthlyArray(countsMap, monthsAgo = 3) {
  const result = [];
  const today = new Date();
  for (let i = monthsAgo; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    let total = 0;

    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const dd = new Date(d.getFullYear(), d.getMonth(), day);
      const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`;
      total += countsMap[key] || 0;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    result.push({
      label: monthNames[d.getMonth()],
      count: total,
    });
  }
  return result;
}
