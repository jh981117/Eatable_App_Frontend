import { jwtDecode } from 'jwt-decode';
import React from 'react';



export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}