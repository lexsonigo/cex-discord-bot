import { Events } from 'discord.js';
import { client } from './client';
import { initProductsChecker } from './products-checker';

if (!process.env.DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN is not defined .env');
  process.exit(1);
}

if (!process.env.DISCORD_CHANNEL_ID) {
  console.error('DISCORD_CHANNEL_ID is not defined in .env');
  process.exit(1);
}

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag} 🍸`);

  await initProductsChecker();
});

client.login(process.env.DISCORD_TOKEN);
