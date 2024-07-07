- Astral Oberserver
  - [Astral Oberserver](#astral-oberserver)
  - [Getting Started](#getting-started)
  - [Learn More](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# or run a docker daemon and
make deploy
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.]

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## TODO

- [x] Add a `Dockerfile` to the project
- [x] Add a `Makefile` to the project
- [x] Make `Landing` page
- [x] Make `Header` and `Footer`
- [x] Add Keplr Wallet support via npx-cosmos-app code
- [x] Add `NFT Collection` page
- [x] Add `NFT Collection` quantity filter
- [x] Add `Background` swap functionality
- [x] Refactor WalletConnection for modularity/readability
- [ ] Remove excessive chains
- [ ] Remove excess fonts
- [ ] Add `NFT position` functionality
- [ ] Store `Backgrounds` in local storage
- [ ] Store `NFT position` in local storage
- [ ] Touch up mobile view

## Opportunities

- [ ] Rework Header, add subheader cleanup for settings on Collection View?
- [ ] Add `NFT Detail` page
  - [ ] More NFT specific details
  - [ ] Link to a Mktplace
  - [ ] Buy/Sell?
- [ ] Create profiles
- [ ] Save to external DB instead of local storage
