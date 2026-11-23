// Demo staff login: a PIN unlocks editing in this browser tab. The real site would use Firebase Auth.
import { useSyncExternalStore } from "react";
import { useSchool } from "../schoolContext";

export type StaffRole = "principal" | "incharge";

export const DEMO_PINS: Record<string, StaffRole> = { "1111": "principal", "2222": "incharge" };

const CHANGED = "staff-changed";
export const OPEN_LOGIN = "staff-open-login";
const key = (udise: string) => `staff-role-${udise}`;

function subscribe(cb: () => void) {
  window.addEventListener(CHANGED, cb);
  return () => window.removeEventListener(CHANGED, cb);
}

function read(udise: string): StaffRole | null {
  try {
    return sessionStorage.getItem(key(udise)) as StaffRole | null;
  } catch {
    return null;
  }
}

export function setStaffRole(udise: string, role: StaffRole | null): void {
  try {
    if (role) sessionStorage.setItem(key(udise), role);
    else sessionStorage.removeItem(key(udise));
  } catch {
    // Private mode: login just won't persist.
  }
  window.dispatchEvent(new Event(CHANGED));
}

export function useStaffRole(): StaffRole | null {
  const { udise } = useSchool();
  return useSyncExternalStore(subscribe, () => read(udise));
}

export function openStaffLogin(): void {
  window.dispatchEvent(new Event(OPEN_LOGIN));
}
