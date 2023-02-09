// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { KoiosProvider, AppWallet, ForgeScript, largestFirst, Transaction } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const recipientAddress = req.body.recipientAddress;
  const utxos = req.body.utxos;

  const koiosProvider = new KoiosProvider('preprod');
  koiosProvider.onTxConfirmed

  const appWallet = new AppWallet({
    networkId: 0,
    fetcher: koiosProvider,
    submitter: koiosProvider,
    key: {
      type: 'mnemonic',
      words: [
        "smile",
        "depend",
        "solid",
        "athlete",
        "section",
        "mirror",
        "coast",
        "notable",
        "kick",
        "poem",
        "chalk",
        "biology",
        "proof",
        "forget",
        "satoshi",
        "uniform",
        "charge",
        "three",
        "forest",
        "elite",
        "scout",
        "banner",
        "dinner",
        "assume"
      ]
    }
  })
  const appWalletAddress = appWallet.getPaymentAddress();
  const forgingScript = ForgeScript.withOneSignature(appWalletAddress);

  const assetName = 'Tuesday Token';

  const assetMetadata: AssetMetadata = {
    "name": 'Tuesday Token',
    "image": 'ipfs://QmWbKsi1f4M3DFTd7aiqfvJ8SYwQ4gZdnCbTzPV3YGNDtx',
    "mediaType": 'image/png',
    "description": 'This NFT is minted by mayanhavoc.',
};  

  const asset: Mint = {
    assetName: assetName,
    assetQuantity: '1',
    metadata: assetMetadata,
    label: '721',
    recipient: recipientAddress,
  };

  const costLovelace = '10000000';
  const selectedUtxos = largestFirst(costLovelace, utxos, true);
  const bankWalletAddress = 'addr_test1qp9jlvh7xfpwhednuqntekdve2za87vdesya8atxx9sd0ss48qx7a872uhehg8vvzysqysfkhewul0flashf9wf0r85scp5rx5';

  const tx = new Transaction({ initiator: appWallet });
  tx.setTxInputs(selectedUtxos);
  tx.mintAsset(forgingScript, asset);
  tx.sendLovelace(bankWalletAddress, costLovelace);
  tx.setChangeAddress(recipientAddress);
  const _unsignedTx = await tx.build();
  console.log(_unsignedTx)
  const unsignedTx = await appWallet.signTx(_unsignedTx, true);
  res.status(200).json({ unsignedTx: unsignedTx });
}
