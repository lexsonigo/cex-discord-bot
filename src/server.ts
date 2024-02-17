import express from 'express';

import { setupDiscordClient } from './client';
import { PORT } from './constants';
import { logAppLaunching } from './logs';

express()
  .listen(PORT, async () => {
    logAppLaunching(PORT);
    await setupDiscordClient();
  });
