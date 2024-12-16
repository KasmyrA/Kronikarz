/* eslint-disable @typescript-eslint/no-namespace */
import { config } from 'dotenv';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
    }
  }
}

export function loadEnv() {
  config();

  const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

  if (!(REFRESH_TOKEN_SECRET && ACCESS_TOKEN_SECRET)) {
    console.error('Token secrets are undefined');
    process.exit(1);
  }
}