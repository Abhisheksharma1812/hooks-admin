import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
    
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // convert ms to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token", error);
    return true; // treat invalid token as expired
  }
}