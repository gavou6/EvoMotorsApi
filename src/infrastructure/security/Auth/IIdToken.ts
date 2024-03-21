export interface IIdToken {
  sub: string;
  "cognito:groups": string[];
  email_verified: boolean;
  iss: string;
  phone_number_verified: boolean;
  "cognito:username": string;
  given_name: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
}
