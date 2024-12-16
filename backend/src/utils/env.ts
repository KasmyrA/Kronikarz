/* eslint-disable @typescript-eslint/no-namespace */
import { config } from 'dotenv';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
    }
  }
}

export function loadEnv() {
  config();

  const { ACCESS_TOKEN_SECRET } = process.env;

  if (!ACCESS_TOKEN_SECRET) {
    console.error('Access token secret is undefined');
    process.exit(1);
  }
}