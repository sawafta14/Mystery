
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface Member {
  id: string;
  name: string;
  username: string;
  bio: string;
  birthDate: string;
  gender: Gender;
  image: string;
  isBest?: boolean;
}

export interface ContentItem {
  id: string;
  type: 'news' | 'photo' | 'meme' | 'scandal' | 'poetry' | 'dhikr' | 'stream';
  authorId: string;
  authorName: string;
  imageUrl?: string;
  text: string;
  createdAt: number;
}

export interface Giveaway {
  id: string;
  prize: string;
  winnersCount: number;
  endTime: number;
  participants: string[];
  winners: string[];
  createdBy: string;
  active: boolean;
}

export interface Message {
  id: string;
  toMemberId: string;
  text: string;
  createdAt: number;
}

export interface GameRoom {
  id: string;
  code: string;
  game: 'xo';
  players: string[];
  board: (string | null)[];
  turn: string;
  winner: string | null;
}
