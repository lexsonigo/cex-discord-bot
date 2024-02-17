import dotenv from 'dotenv';

export const {
  TOKEN = null,
  CLIENT_ID = null,
  GUILD_ID = null,
  CHANNEL_ID = null,
  PORT = '4200',
} = dotenv.config()?.parsed || {};
