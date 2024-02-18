import { EmbedBuilder } from "discord.js";
import type { BoxDetails } from "./box-details";

function sanitizeUrl(url: string): string {
  return new URL(url).toString();
}

export function createProductMessage(boxDetails: BoxDetails): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle(`Quantity: ${boxDetails.ecomQuantityOnHand}`)
    .setAuthor({ name: boxDetails.boxName, iconURL: sanitizeUrl(boxDetails.imageUrls.small), url: `https://wss2.cex.uk.webuy.io/v3/boxes/${boxDetails.boxId}/detail` })
    .setDescription(`${boxDetails.superCatFriendlyName} / ${boxDetails.categoryFriendlyName}`)
    .setThumbnail(sanitizeUrl(boxDetails.imageUrls.medium))
    .setTimestamp();
}

export function createNoProductMessage(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x808080)
    .setTitle('No products available')
    .setDescription('Check back later!')
    .setTimestamp();
}
