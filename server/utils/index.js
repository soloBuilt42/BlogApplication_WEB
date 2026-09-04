import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const hashString = async (value) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(String(value), salt);
};

export const compareString = async (plainValue, hashedValue) => {
  if (!plainValue || !hashedValue) return false;
  return bcrypt.compare(String(plainValue), hashedValue);
};

export function createJWT(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}

export function generateOTP() {
  const min = 100000;
  const max = 999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createSlug(title) {
  return (
    String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") + `-${Date.now().toString(36)}`
  );
}
