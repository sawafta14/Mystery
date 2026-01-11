
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import { Member, ContentItem, Giveaway, Message, GameRoom } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyDy0LEQjVwM5YvYb4XH0RbaCZ-cgfaa2gY",
  authDomain: "mystery-60324.firebaseapp.com",
  projectId: "mystery-60324",
  storageBucket: "mystery-60324.firebasestorage.app",
  messagingSenderId: "620810593644",
  appId: "1:620810593644:web:b176fdbd8c5044ef5fff49",
  measurementId: "G-V9CDNQRP7E"
};

const app = initializeApp(firebaseConfig);
const db_firestore = getFirestore(app);

const DOC_ID = "global_state";

export interface DB {
  members: Member[];
  content: ContentItem[];
  giveaways: Giveaway[];
  messages: Message[];
  gameRooms: GameRoom[];
  bestMemberId: string | null;
}

const initialDB: DB = {
  members: [],
  content: [],
  giveaways: [],
  messages: [],
  gameRooms: [],
  bestMemberId: null
};

export const subscribeToDB = (callback: (db: DB) => void) => {
  return onSnapshot(doc(db_firestore, "clan", DOC_ID), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as DB);
    } else {
      setDoc(doc(db_firestore, "clan", DOC_ID), initialDB);
      callback(initialDB);
    }
  });
};

export const saveDB = async (db: DB) => {
  try {
    await setDoc(doc(db_firestore, "clan", DOC_ID), db);
  } catch (e) {
    console.error("Firebase Sync Error: ", e);
  }
};

export const isAdmin = (password: string) => password === 'SVO';

export const toBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
