import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { CLIENT_ID, GUILD_ID, TOKEN } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: any[] = [];

if (TOKEN && CLIENT_ID && GUILD_ID) {
  if (COMMANDS.length > 0) {
    new REST({ version: '9' })
      .setToken(TOKEN)
      .put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: COMMANDS.map(command => command.toJSON()) }
      )
      .then(() => console.log('Successfully registered commands.'))
      .catch(console.error);
  }
} else {
  throw new Error('Discord API informations are missing. Please set your environment variables.');
}
