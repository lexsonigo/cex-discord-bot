/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client, Intents, MessageEmbed } from 'discord.js';

import { CHANNEL_ID, TOKEN } from './constants';

import { catchError, concatMap, filter, finalize, from, interval, map, of, switchMap, take, tap } from 'rxjs';
import PRODUCTS from './products.json';

export async function setupDiscordClient(): Promise<void> {
  if (!TOKEN) return;

  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

  client.once('ready', async () => {
    if (!CHANNEL_ID) return;

  const channel = client.channels.cache.get(CHANNEL_ID);

  async function getProductInformations() {
    if (!channel) return;

    if (!channel.isText()) return;

    const productInterval = 5000;
    let hasItemWithStock = false;

    interval((60 * 1000 * 15) + productInterval * PRODUCTS.length).pipe(
      switchMap(() =>
        interval(productInterval).pipe(
          tap((i) => {
            if (i === 0) {
              console.log('Scanning products...');
              hasItemWithStock = false;
            }
          }),
          take(PRODUCTS.length),
          map(index => PRODUCTS[index]),
          map(productId => `https://wss2.cex.uk.webuy.io/v3/boxes/${productId}/detail`),
          tap(data => console.log('URL', data)),
          concatMap((url) => from(fetch(url)).pipe(
            switchMap((response: any) => response.json()),
            tap(data => console.log('RESPONSE:', data)),
          )),
          map((data: any) => data['response']['data']['boxDetails'][0]),
          map((details: any) => details['ecomQuantityOnHand'] === 0 ? null : details),
          catchError(() => of(null)),
          filter((details) => details !== null),
          map((details) => new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle(details['boxName'])
            .setURL(`https://wss2.cex.uk.webuy.io/v3/boxes/${details['boxId']}/detail`)
            .setDescription(details['boxId'])
            .setThumbnail(new URL(details['imageUrls']['medium']).toString())
            .addField('Quantity', `${details['ecomQuantityOnHand']}`, true )
            .setTimestamp()
          ),
          tap((message) => channel.send({ embeds: [message] }),
          finalize(() => {
            console.log('Finished scanning products...');
            if (hasItemWithStock === false) {
              channel.send('No items with stock found.');
            }
          }),
        )
      ),
    )).subscribe();
  }

    console.log('Bot is ready!');

    if (!CHANNEL_ID) return;

    await getProductInformations();
  });

  await client.login(TOKEN);
}

