export interface GetBoxDetailsPresentation {
  response: {
    data: {
      boxDetails: [BoxDetails];
    }
  }
}

export interface BoxDetails {
  boxId: string;
  boxName: string;
  categoryId: number;
  categoryName: string;
  categoryFriendlyName: string;
  superCatId: number;
  superCatName: string;
  superCatFriendlyName: string;
  cannotBuy: number;
  isNewBox: number;
  cashPrice: number;
  exchangePrice: number;
  sellPrice: number;
  firstPrice: number;
  previousPrice: number;
  lastPriceUpdatedDate:     Date;
  boxRating: number;
  collectionQuantity: number;
  outOfStock: number;
  ecomQuantityOnHand: number;
  webSellAllowed: number;
  webBuyAllowed: number;
  webShowSellPrice: number;
  webShowBuyPrice: number;
  boxSaleAllowed: number;
  boxBuyAllowed: number;
  boxWebSaleAllowed: number;
  boxWebBuyAllowed: number;
  imageUrls: ImageUrls;
  isMasterBox: number;
}

export interface ImageUrls {
  large: string;
  medium: string;
  small: string;
}
