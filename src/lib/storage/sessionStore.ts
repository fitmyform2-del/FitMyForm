import { RecentItem } from '@/types/document';

const STORAGE_KEY = 'fitmyform_recent_history';
const MAX_HISTORY = 10;

export function getRecentHistory(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read history:', err);
    return [];
  }
}

export function saveRecentItem(item: Omit<RecentItem, 'id' | 'timestamp'>): RecentItem {
  if (typeof window === 'undefined') {
    return { ...item, id: Date.now().toString(), timestamp: new Date().toISOString() };
  }

  const history = getRecentHistory();
  const newItem: RecentItem = {
    ...item,
    id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updated = [newItem, ...history.filter(h => h.fileName !== item.fileName)].slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recent history:', err);
  }

  return newItem;
}

export function clearRecentHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}
