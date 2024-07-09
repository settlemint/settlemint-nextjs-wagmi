"use client";

import Head from "next/head";
import { useCallback, useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import contractData from "../../contractData/GenericERC20.json";
import { getAddress } from "viem";

export default function Home() {
  const [to, setTo] = useState<string>("");
  const [value, setValue] = useState<string>("");
  useAccount();
  const address = getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

  const { writeContractAsync, isPending, isSuccess } = useWriteContract();
  const { data } = useReadContract({
    address,
    abi: contractData.abi,
    functionName: "symbol",
  });

  const writeContract = useCallback(
    () =>
      writeContractAsync({
        address,
        abi: contractData.abi,
        functionName: "transfer",
        args: [to, value],
      }),
    [address, to, value, writeContractAsync]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Head>
        <title>Send Tokens</title>
      </Head>

      <main className="my-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Send Your Tokens</h1>
        <h3 className="text-2xl font-bold mb-4">
          <p>Token to Send: {data as string}</p>
        </h3>

        <div className="mb-2">
          <input
            type="text"
            placeholder="Send Tokens To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="p-2 border border-gray-400 rounded-md text-black"
          />
        </div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="How Many Tokens?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="p-2 border border-gray-400 rounded-md text-black"
          />
        </div>

        <div>
          <button
            onClick={writeContract}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send Tokens
          </button>
          {isPending && <p className="mt-2">Sending Tokens</p>}
          {isSuccess && <p className="mt-2">Tokens Sent</p>}
        </div>
      </main>
    </div>
  );
}
