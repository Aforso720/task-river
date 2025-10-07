const TOKEN_KEY = "access_token";

let memToken = null;

let bc;
try { bc = new BroadcastChannel("auth"); } catch {  }

function readFromLS() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function writeToLS(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
memToken = readFromLS();

export const tokenStorage = {
  key: TOKEN_KEY,

  get() {
    if (!memToken) memToken = readFromLS();
    return memToken || null;
  },

  set(token) {
    memToken = token || null;
    writeToLS(memToken);
    try { bc && bc.postMessage({ type: "TOKEN_SET", token: memToken }); } catch {}
  },

  clear() {
    memToken = null;
    writeToLS(null);
    try { bc && bc.postMessage({ type: "TOKEN_CLEAR" }); } catch {}
  },
};

try {
  window.addEventListener("storage", (e) => {
    if (e.key === TOKEN_KEY) memToken = e.newValue || null;
  });
} catch {}

try {
  bc && (bc.onmessage = (e) => {
    if (!e?.data) return;
    if (e.data.type === "TOKEN_SET") memToken = e.data.token || null;
    if (e.data.type === "TOKEN_CLEAR") memToken = null;
  });
} catch {}
