import { decode } from "jsonwebtoken";

/**
 * Decodes a JWT token without verifying its signature.
 * @param {string} token - The JWT token to decode.
 * @returns {object} The decoded payload of the token.
 */
export const decodeToken = (token: string) => {
  return decode(token);
};
