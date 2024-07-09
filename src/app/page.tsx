"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ConnectKitButton } from "connectkit";
import Head from "next/head";
import { useCallback, useState } from "react";
import { getAddress } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import contractData from "../../contractData/GenericERC20.json";
import { portal } from "./portal/portal";

export default function Home() {
  const [to, setTo] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const account = useAccount();
  const address = getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "");
  const isAccountConnected = account.status === "connected";

  const { writeContractAsync, isPending, isSuccess } = useWriteContract();
  const { data } = useSuspenseQuery({
    queryKey: ["symbol"],
    queryFn: async () => {
      const response = await portal.GET(
        "/api/generic-erc-20/{address}/symbol",
        {
          params: { path: { address } },
          parseAs: "text",
        }
      );
      return response.data;
    },
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
        <ConnectKitButton />
        <h3 className="text-2xl font-bold mb-4">
          <p>Token to Send: {data ?? "/"}</p>
        </h3>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Send Tokens To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={!isAccountConnected}
            className="p-2 border border-gray-400 rounded-md text-black"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="How Many Tokens?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isAccountConnected}
            className="p-2 border border-gray-400 rounded-md text-black"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={writeContract}
            disabled={!isAccountConnected}
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
