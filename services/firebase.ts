import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { SavingsState } from '../types';

// TODO: REPLACE WITH YOUR FIREBASE CONFIG
// Get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBA8DBZBfDAbFFJiB3H1BtXmEybVaJkJBU",
  authDomain: "money-envelopes-15d99.firebaseapp.com",
  projectId: "money-envelopes-15d99",
  storageBucket: "money-envelopes-15d99.firebasestorage.app",
  messagingSenderId: "524924834638",
  appId: "1:524924834638:web:fea61099db95bb0863041f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'savings_states';

export const generateSyncId = (): string => {
  // Generate a random 6-character ID (easy to type, e.g., "k9x2mp")
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'; // no confusing chars like l, 1, i, o, 0
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Insert a dash for readability? Optional. Let's keep it simple 6 chars for now.
  return result;
};

export const saveRemoteState = async (id: string, state: SavingsState) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // We explicitly exclude any previous internal fields and just save the state + timestamp
    // Using setDoc overwrites the document (or creates if new) which is what we want for "state sync"
    await setDoc(docRef, { 
      ...state, 
      _lastUpdated: new Date().toISOString() 
    });
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    throw error;
  }
};

export const loadRemoteState = async (id: string): Promise<SavingsState | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Clean up internal metadata
      const { _lastUpdated, ...cleanState } = data;
      return cleanState as SavingsState;
    }
  } catch (error) {
    console.error("Error loading from Firebase:", error);
  }
  return null;
};

export const subscribeToState = (id: string, callback: (state: SavingsState) => void) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const { _lastUpdated, ...cleanState } = data;
      callback(cleanState as SavingsState);
    }
  });
};