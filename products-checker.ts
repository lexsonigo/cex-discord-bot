import axios from 'axios';
import { BehaviorSubject, Observable, catchError, concatMap, delay, from, map, of, take, tap, toArray } from 'rxjs';

import fs from 'fs';
import type { BoxDetails, GetBoxDetailsPresentation } from "./box-details";
import { sendMessage } from './client';
import { createProductMessage } from './create-message';
import { log } from "./log";
import { storage } from './storage';

const value = fs.readFileSync("./products.json", "utf8")
const PRODUCTS: string[] = JSON.parse(value);

const GET_PRODUCTS_LIST_INTERVAL = 15 * 60 * 1_000;
const GET_PRODUCT_INTERVAL = 5 * 1_000;

export async function initProductsChecker(): Promise<void> {
  const checkProducts$ = new BehaviorSubject<void>(void 0);

  checkProducts$.pipe(
    tap(() => log('Checking products...')),
    concatMap(() => getProducts()),
    tap(() => log(`Products checked! Waiting ${GET_PRODUCTS_LIST_INTERVAL}ms before checking again all products...`)),
    delay(GET_PRODUCTS_LIST_INTERVAL),
    tap(() => checkProducts$.next())
  ).subscribe();
}

function getProducts(): Observable<(BoxDetails | null)[]> {
  const i$ = new BehaviorSubject(0);

  return i$.asObservable().pipe(
    tap((i) => log(`Checking product ${PRODUCTS[i]}...`)),
    concatMap((i) => fetchProductDetails(PRODUCTS[i])),
    delay(GET_PRODUCT_INTERVAL),
    tap(() => {
      const next = i$.value + 1;
      if (next < PRODUCTS.length) {
        i$.next(next);
      }
    }),
    take(PRODUCTS.length),
    toArray()
  );
}

function fetchProductDetails(id: string): Observable<BoxDetails | null> {
  return from(axios.get<GetBoxDetailsPresentation>(`https://wss2.cex.uk.webuy.io/v3/boxes/${id}/detail`)).pipe(
    map(response => {
      if (response.status === 200) {
        const product = response.data.response.data.boxDetails[0];
        const lastQuantity = storage.get(product.boxId) ?? null;

        log(`Product ${product.boxId} was checked. Quantity: ${product.ecomQuantityOnHand}. ${lastQuantity !== null ? `Last quantity: ${lastQuantity}. `: '' }Waiting ${GET_PRODUCT_INTERVAL}ms seconds before checking the next product...`);

        if (product.ecomQuantityOnHand > 0 && lastQuantity !== null && lastQuantity < product.ecomQuantityOnHand) {
          sendMessage(createProductMessage(product));
        }

        storage.set(product.boxId, product.ecomQuantityOnHand);

        return product;
      } else {
        log(`Error ${response.status} while fetching product ${id}.`)
        return null;
      }
    }),
    catchError(err => {
      log(`Error ${err.toString()} while fetching product ${id}.`)
      return of(null)
    })
  );
}
