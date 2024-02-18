import { DateTime } from "luxon";

export function log(message: string): void {
  const _now = DateTime.now().setLocale('fr');
  console.log(`[${_now.toLocaleString(DateTime.DATE_SHORT)} ${_now.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}] ${message}`);
}