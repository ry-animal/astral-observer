export interface Token {
  id: string;
  tokenId: string;
  name: string;
  rarityOrder: number | null;
  rarityScore: number | null;
  mintedAt: string;
  saleType: string | null;
  media: {
    url: string;
    type: string;
  };
  collection: {
    name: string;
    contractAddress: string;
  };
}

export interface OwnedTokensResponse {
  data: {
    tokens: {
      tokens: Token[];
      pageInfo: {
        total: number;
        limit: number;
        offset: number;
      };
    };
  };
}
