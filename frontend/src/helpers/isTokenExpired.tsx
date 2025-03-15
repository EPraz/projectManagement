import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  // otros claims
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};
