import { tokenStorage } from "./tokenStorage";
import { getExpMs } from "./jwt";

let timeoutId = null;

function scheduleAutoLogout(onExpire) {
  clearTimeout(timeoutId);
  const token = tokenStorage.get();
  if (!token) return;

  const expMs = getExpMs(token);
  if (!expMs) return; 
  const delta = expMs - Date.now() - 60_000; 
  if (delta <= 0) {
    onExpire?.();
  } else {
    timeoutId = setTimeout(() => onExpire?.(), delta);
  }
}

export const tokenManager = {
  set(token, onExpire) {
    tokenStorage.set(token);
    scheduleAutoLogout(onExpire);
  },
  clear() {
    clearTimeout(timeoutId);
    timeoutId = null;
    tokenStorage.clear();
  },
  reschedule(onExpire) {
    scheduleAutoLogout(onExpire);
  }
};
