import { ref, push, set, get, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import type { LeaderboardEntry } from '../types/leaderboard';

const LEADERBOARD_REF = 'leaderboard';
const MAX_ENTRIES = 100;

/**
 * Додає новий запис до таблиці лідерів у Firebase
 */
export async function addFirebaseLeaderboardEntry(
  playerName: string,
  time: number,
  mazeSize: string
): Promise<void> {
  try {
    const leaderboardRef = ref(database, LEADERBOARD_REF);
    const newEntryRef = push(leaderboardRef);
    
    const entry: Omit<LeaderboardEntry, 'id'> = {
      playerName,
      time,
      date: new Date().toISOString(),
      mazeSize
    };
    
    await set(newEntryRef, entry);
    
    // Видаляємо старі записи, якщо їх більше MAX_ENTRIES
    await cleanupOldEntries();
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    throw error;
  }
}

/**
 * Отримує топ N записів з Firebase
 */
export async function getFirebaseTopEntries(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardRef = ref(database, LEADERBOARD_REF);
    const topQuery = query(
      leaderboardRef,
      orderByChild('time'),
      limitToLast(limit)
    );
    
    const snapshot = await get(topQuery);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((childSnapshot) => {
      entries.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    
    // Сортуємо за часом (найкращі результати спочатку)
    return entries.sort((a, b) => a.time - b.time);
  } catch (error) {
    console.error('Error getting top entries:', error);
    return [];
  }
}

/**
 * Підписується на зміни в таблиці лідерів (реального часу)
 */
export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void,
  limit: number = 10
): () => void {
  const leaderboardRef = ref(database, LEADERBOARD_REF);
  const topQuery = query(
    leaderboardRef,
    orderByChild('time'),
    limitToLast(limit * 2) // Беремо більше для сортування
  );
  
  const unsubscribe = onValue(topQuery, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((childSnapshot) => {
      entries.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    
    // Сортуємо та обмежуємо до потрібної кількості
    const sortedEntries = entries
      .sort((a, b) => a.time - b.time)
      .slice(0, limit);
    
    callback(sortedEntries);
  }, (error) => {
    console.error('Error subscribing to leaderboard:', error);
  });
  
  return unsubscribe;
}

/**
 * Видаляє найстаріші записи, якщо їх більше MAX_ENTRIES
 */
async function cleanupOldEntries(): Promise<void> {
  try {
    const leaderboardRef = ref(database, LEADERBOARD_REF);
    const snapshot = await get(leaderboardRef);
    
    if (!snapshot.exists()) {
      return;
    }
    
    const entries: Array<{ id: string; date: string }> = [];
    snapshot.forEach((childSnapshot) => {
      entries.push({
        id: childSnapshot.key as string,
        date: childSnapshot.val().date
      });
    });
    
    if (entries.length > MAX_ENTRIES) {
      // Сортуємо за датою
      entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Видаляємо найстаріші
      const toDelete = entries.slice(0, entries.length - MAX_ENTRIES);
      
      for (const entry of toDelete) {
        const entryRef = ref(database, `${LEADERBOARD_REF}/${entry.id}`);
        await set(entryRef, null);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old entries:', error);
  }
}

/**
 * Отримує всі записи з Firebase
 */
export async function getAllFirebaseEntries(): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardRef = ref(database, LEADERBOARD_REF);
    const snapshot = await get(leaderboardRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((childSnapshot) => {
      entries.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    
    return entries.sort((a, b) => a.time - b.time);
  } catch (error) {
    console.error('Error getting all entries:', error);
    return [];
  }
}
