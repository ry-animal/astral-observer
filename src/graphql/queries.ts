import { OwnedTokensResponse, Token } from './interface';

export const fetchOwnedTokens = async (owner: string, limit: number): Promise<Token[]> => {
  const response = await fetch('https://graphql.mainnet.stargaze-apis.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apollo-operation-name': 'OwnedTokens',
    },
    body: JSON.stringify({
      operationName: 'OwnedTokens',
      variables: {
        owner: owner,
        filterForSale: null,
        sortBy: 'ACQUIRED_DESC',
        filterByCollectionAddrs: null,
        limit: limit,
      },
      query: `
            query OwnedTokens($owner: String, $seller: String, $limit: Int, $offset: Int, $filterByCollectionAddrs: [String!], $filterForSale: SaleType, $sortBy: TokenSort) {
              tokens(
                ownerAddrOrName: $owner
                sellerAddrOrName: $seller
                limit: $limit
                offset: $offset
                filterForSale: $filterForSale
                filterByCollectionAddrs: $filterByCollectionAddrs
                sortBy: $sortBy
              ) {
                tokens {
                  id
                  tokenId
                  name
                  rarityOrder
                  rarityScore
                  mintedAt
                  saleType
                  media {
                    url
                    type
                  }
                  collection {
                    name
                    contractAddress
                  }
                }
                pageInfo {
                  total
                  limit
                  offset
                }
              }
            }
          `,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: OwnedTokensResponse = await response.json();

  const filteredTokens = data.data.tokens.tokens.filter(
    (token) => token.media.type !== 'html' && (token.media.type === 'image' || token.media.type === 'animated_image'),
  );

  return filteredTokens;
};
