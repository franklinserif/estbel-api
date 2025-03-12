export interface Payload {
  sub: string;
  email: string;
  exp: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
