export interface Payload {
  sub: string;
  email: string;
  expiresIn: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
