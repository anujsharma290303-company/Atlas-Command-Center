export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  rank: string;
  price_usd: string;
  percent_change_24h: string;
  market_cap_usd: string;
  [key: string]: unknown;
}

export interface CoinLoreResponse {
  data: CryptoCoin[];
}