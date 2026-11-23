import type { Category } from "./schemes";
import { useLocalList } from "./localStore";

// A parent who asked for scheme alerts for their child.
export interface AlertSubscriber {
  id: string;
  student: string;
  cls: number;
  girl: boolean;
  cat: Category;
  parent: string;
  phone: string; // 10-digit mobile
  createdAt: number;
}

export interface AlertSent {
  schemeId: string;
  subscriberId: string;
  at: number;
}

export function useSubscribers(udise: string) {
  return useLocalList<AlertSubscriber>(`scheme-subscribers-${udise}`);
}

export function useSentLog(udise: string) {
  return useLocalList<AlertSent>(`scheme-sent-${udise}`);
}
