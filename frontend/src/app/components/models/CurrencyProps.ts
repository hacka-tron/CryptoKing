import { Currency } from "./Currencies";

export interface CurrencyProp {
  currency: Currency;
  hide: boolean;
  isFavorite: boolean;
  toBuy: boolean;
  beingBought: number;
}
