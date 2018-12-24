import {Coin} from "./Coins";
export interface Wallet {
  id: string;
  owner: string;
  name: string;
  dollars: number;
  coins: [Coin];
}
