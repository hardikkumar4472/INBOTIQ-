const blacklist = new Map();

export const addTokenToBlacklist = (token, expSeconds) => {

  try {
    const [, payloadB64] = token.split(".");
    const payloadJSON = Buffer.from(payloadB64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJSON);
    const exp = payload.exp ? payload.exp * 1000 : Date.now() + (expSeconds || 7 * 24 * 60 * 60 * 1000);
    blacklist.set(token, exp);
  } catch {
    blacklist.set(token, Date.now() + (expSeconds || 7 * 24 * 60 * 60 * 1000));
  }
};

export const isTokenBlacklisted = (token) => {
  const exp = blacklist.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    blacklist.delete(token);
    return false;
  }
  return true;
};

export const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [token, exp] of blacklist.entries()) {
    if (now > exp) blacklist.delete(token);
  }
};