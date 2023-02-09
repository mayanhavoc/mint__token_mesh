import { createTransaction } from '@/backend';
import { KoiosProvider } from '@meshsdk/core';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { useState } from 'react';

export default function Home(){
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { wallet, connected } = useWallet();

  async function mintToken(){
    setLoading(true)
    const changeAddress = await wallet.getChangeAddress();
    console.log('changeAddress', changeAddress)
    
    const utxos = await wallet.getUtxos();
    console.log('utxos', utxos)
    
    // signed by dApp using AppWallet
    const { unsignedTx } = await createTransaction(changeAddress, utxos);  
    console.log( 'unsignedTx', unsignedTx)

    // signed by client to pay for token using BrowserWallet
    const signedTx = await wallet.signTx(unsignedTx, true);
    console.log('signedTx', signedTx)

    const txHash = await wallet.submitTx(signedTx);
    console.log('txHash', txHash)
    setTxHash(txHash)
    setLoading(false);

    const koiosProvider = new KoiosProvider('preprod');

    koiosProvider.onTxConfirmed(txHash, () => {
      setSuccess(true);
      console.log('Transaction confirmed');
    });
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column', 
        margin: '2rem',
        padding: '4em 2em'
      }}
    >
      {txHash && (
        <>
        <p>
          <b>Tx Hash:</b>
          <br/>
          {txHash}
        </p>
        { success ? (
          <p>Transaction confirmed</p>
        ) : (
          <p>Waiting confirmation...</p>
        )}
        </>
      )}
        <div
          style={{
            justifySelf: 'end',
            alignSelf: 'end'
          }}
        >
          <CardanoWallet /> 
        </div>
        <div
          style={{
            justifySelf: 'center', 
            alignSelf: 'center',
          }}
        >
          {
            connected &&
            <button 
              onClick={() => mintToken()}
              disabled={loading}
              style={{
                fontSize: '1.25em',
                padding: '0.5em 2em',
                borderRadius: '1em',
                margin: '1em', 
                backgroundColor: loading ? 'orange' : 'green',
              }}
              >
              Mint Token
            </button>
          } 
        </div>
    </div>
  )
}