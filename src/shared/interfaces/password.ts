export interface IPasswordService {
  generateTemporaryPassword(length?: number, useSymbols?: boolean): string;
  hashPassword(password: string, saltRounds?: number): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

export interface IPasswordConfig {
  defaultLength: number;
  defaultSaltRounds: number;
  useSymbolsByDefault: boolean;
}
