export interface Toast {
  id: number;
  icon: string;
  msg: string;
}

export interface NightEatRecord {
  id: number;
  food: string;
  quantity: string;
  time: string;
  reason: string;
  emotion: string;
  date: string;
}

export interface ReceiptItem {
  name: string;
  amount: number;
  category?: string;
}

export interface ReceiptData {
  items?: ReceiptItem[];
  total?: number;
  store?: string;
  date?: string;
  raw?: string;
}

export interface StickerResult {
  sticker: {
    id: string;
    name: string;
    icon: string;
    rarity: string;
  };
  isNew: boolean;
}

export interface ExpenseFormData {
  name: string;
  amount: string;
  category: string;
  memo: string;
}

export type PageType = 'home' | 'ledger' | 'sticker' | 'village' | 'mypage';
export type ModalType = 'add' | 'edit' | 'receipt' | null;