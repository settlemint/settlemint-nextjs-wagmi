import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi'; 
import {contractData} from '../../contractData/data'
import useIsMounted from './useIsMounted';

const Home: NextPage = () => {
    const [to, setTo] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const mounted = useIsMounted();
  
   
    const { isLoading, isSuccess, write } = useContractWrite({
      address: contractData.address,
      abi: contractData.abi,
      functionName: 'transfer',
      args: [to, value],
    })
  
    const { data } = useContractRead({
      address: contractData.address,
      abi: contractData.abi,
      functionName: 'symbol',
      watch: true
    })
  

    return ( 

<div className="flex flex-col items-center justify-center h-screen">
  <Head> 
    <title>Send Tokens</title>
  </Head>

  <main className="my-4 flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-4">
      Send Your Tokens 
    </h1>
    <h3 className="text-2xl font-bold mb-4">
      {mounted ? <p>Token to Send: {data}</p> : null}
    </h3>

    <div className="mb-2">
      <input type="text" placeholder='Send Tokens To' value={to} onChange={(e) => setTo(e.target.value)} className="p-2 border border-gray-400 rounded-md text-black"/>
    </div>

    <div className="mb-2">
      <input type="text" placeholder='How Many Tokens?' value={value} onChange={(e) => setValue(e.target.value)} className="p-2 border border-gray-400 rounded-md text-black"/>
    </div>

    <div>
      <button disabled={!write} onClick={() => write()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Send Tokens 
      </button> 
      {mounted ? isLoading && <p className="mt-2">Sending Tokens</p> : null}
      {mounted ? isSuccess && <p className="mt-2">Tokens Sent</p> : null}
    </div>
  </main>
</div>

    )

}; 

export default Home;