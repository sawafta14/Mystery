
import { Member, ContentItem, Giveaway, Message, GameRoom } from './types';

const DB_KEY = 'mystery_db_v2';
const syncChannel = new BroadcastChannel('mystery_sync');

interface DB {
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

export const getDB = (): DB => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : initialDB;
};

export const saveDB = (db: DB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  syncChannel.postMessage('update'); // إرسال تنبيه للتحديث اللحظي
};

export const onDBSync = (callback: () => void) => {
  syncChannel.onmessage = () => callback();
};

export const isAdmin = (password: string) => password === 'SVO';

export const toBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
