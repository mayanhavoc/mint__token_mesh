# Mesh multi-sig transaction demo

At the end of this tutorial you will be able to:

- Connect wallet
- Mint a token that belongs to you

## Getting started

The first thing you want to do is check out the [nextjs starter guide](https://meshjs.dev/guides/nextjs) to find out how to get started.

What you will need before getting started:

- An IDE
- NodeJs

Both can be downloaded through the link provided above.

### Step 1 - Creating a new NextJS application

Create a new NextJs project:

`npx create-next-app@latest --typescript .`

### Step 2 - Installing Mesh

Install MeshJS package

`npm install @meshsdk/core @meshsdk/react`

#### Mesh core and Mesh react

Mesh is divided into two main parts:

- Mesh core: contains all the core functionalities around bulding a transaction, connecting to wallets, etc.
- Mesh react: contains the React components and hooks.

### Step 3 - WebAssembly configuration

WebAssembly is used by Mesh behind the scenes, so it is important that we tell our NextJs application that we are using it by adding the following lines to the configuration file (i.e., next.config.js).

Add webpack configuration in `next.config.js`:

```ts
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};
module.exports = nextConfig;
```

Test that your application runs properly using the terminal command `npm run dev` to run a development server.

### Step 4

Delete unnecesary code on your `/pages/index.tsx` and `/pages/_app.tsx` files. It should look like this:

<!-- /pages/index.tsx -->
```tsx
export default function Home(){
  return (
    <>
    </>
  )
}
```

<!-- /pages/_app_.tsx -->
```tsx
function MyApp() {
  return (
   
  );
}

export default MyApp;
```

### Step 5 - Browser wallet

The `BrowserWallet` connects, queries and performs wallet functions in accordance to [CIP-30](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030)

Head on to [Browser wallet](https://meshjs.dev/apis/browserwallet). Browser wallet is a wallet API that allows our application to communicate with the user's wallet. It is built in accordance with [CIP-30](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030).

Once the user's wallet is connected, you will be able to:

- Get the wallet's balance `getBalance()`: This returns a list of assets in the wallet.
- Get the wallet's address `getChangeAddress()`: Returns an address owned by the wallet that should be used as a change address to return leftover assets during transaction creation back to the connected wallet.
- Get the wallet's network ID (this ID will help determine if it's on the mainnet or testnet) `getNetworkId()`: Returns the network ID of the currently connected account. `0` is testnet and `1` is mainnet, but other networks can possibly returned that are not governed by CIP-30.The result of this function will stay the same unless the connected account is changed.
- Get the wallet's reward address (for staking) `getRewardAddresses()`: Returns a list of reward addresses (i.e. stake address) owned by the wallet.
- Get the wallet's utxos `getUtxos()`: Returns a list of all UTxOs controlled by the wallet. ADA balance and multiasset value in each UTxO are specified in `amount`.
- Prompt the user to sign a transaction `signTx()`: Requests user to sign the provided transaction (`tx`). The wallet should ask the user for permission, and if given, try to sign the supplied body and return a signed transaction. `partialSign` should be `true` if the transaction provided requires multiple signatures.

This are just a few methods available from `BrowserWallet`, to get the complete list, head over to the documentation by clicking on the link at the start of this step.

### Step 6 - Set up the Mesh provider

Head over to the [Getting started with Mesh and React](https://meshjs.dev/react/getting-started) section to find the instructions to install `@meshsdk/react`

