import { BehaviorSubject, Observable, catchError, concatMap, delay, from, map, of, switchMap, take, tap, toArray } from 'rxjs';
import axios from 'axios';

import type { BoxDetails, GetBoxDetailsPresentation } from "./box-details";
import { sendMessage } from './client';
import { createNoProductMessage, createProductMessage } from './create-message';
import { log } from "./log";
import PRODUCTS from "./products.json";

const GET_PRODUCTS_LIST_INTERVAL = 15 * 60 * 1_000;
const GET_PRODUCT_INTERVAL = 5 * 1_000;

export async function initProductsChecker(): Promise<void> {
  const checkProducts$ = new BehaviorSubject<void>(void 0);

  checkProducts$.pipe(
    tap(() => log('Checking products...')),
    concatMap(() => getProducts()),
    tap((items) => {
      log(`Products checked! Waiting ${GET_PRODUCTS_LIST_INTERVAL}ms before checking again all products...`);
      if (items.every(item => item === null || item.ecomQuantityOnHand === 0)) {
        sendMessage(createNoProductMessage());
      }
    }),
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
        log(`Product ${product.boxId} was checked. Waiting ${GET_PRODUCT_INTERVAL}ms seconds before checking the next product...`);
        sendMessage(createProductMessage(product));

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
