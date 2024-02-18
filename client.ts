import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";

export const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

export function sendMessage(message: EmbedBuilder) {

  console.info(message.toJSON());
  
  if (!process.env.DISCORD_CHANNEL_ID) return;

  const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (!channel || !channel.isTextBased()) return;

  // return channel.send({ embeds: [message] });
}
