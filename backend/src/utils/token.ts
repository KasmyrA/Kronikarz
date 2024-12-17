import jwt from 'jsonwebtoken';

export function generateAccessToken(_id: string) {
  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
  return accessToken
}

function validateToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return undefined;
  }
}

// Returns user id if access token is valid
export function validateAccessToken(token: string): string | null {
  const payload = validateToken(token, process.env.ACCESS_TOKEN_SECRET);

  if (typeof payload === "object" && "_id" in payload && typeof payload._id === "string") {
    return payload._id;
  }

  return null;
}