"use client"

import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import Head from "next/head";
import { FaClipboardList, FaCoffee } from "react-icons/fa";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();
  const isAccountConnected = account.status === "connected";

  // const { data: symbol } = useSuspenseQuery({
  //   queryKey: ["symbol"],
  //   queryFn: async () => {
  //     try {
  //       const address = getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "");
  //       const response = await portal.GET("/api/generic-erc-20/{address}/symbol", {
  //         params: { path: { address } },
  //         parseAs: "text",
  //       });
  //       return response.data;
  //     } catch (err) {
  //       if (err instanceof InvalidAddressError) {
  //         return null;
  //       }
  //       throw err;
  //     }
  //   },
  // });

  // Dummy data for the table
  const dummyData = [
    { batchId: "001", partner: "Partner A", note: "First batch" },
    { batchId: "002", partner: "Partner B", note: "Urgent delivery" },
    { batchId: "003", partner: "Partner C", note: "Standard order" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#E6CCB2]">
      <Head>
        <title>Coffee Batch Tracker</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <header className="bg-[#6F4E37] text-[#F5E6D3] p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold font-poppins flex items-center">
              <FaCoffee className="mr-2" /> Coffee Batch Tracker
            </h1>
            <p className="text-sm mt-1 opacity-80">Total Batches: {dummyData.length}</p>
          </motion.div>
          <div className="flex flex-col items-end">
            <ConnectKitButton />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-[#3E2723] flex items-center">
            <FaClipboardList className="mr-2" /> Recent Batches
          </h2>
          <div className="overflow-hidden rounded-lg shadow-xl">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-[#6F4E37] text-white">
                  <th className="py-3 px-6 text-left">Batch ID</th>
                  <th className="py-3 px-6 text-left">Partner</th>
                  <th className="py-3 px-6 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((batch, index) => (
                  <motion.tr
                    key={batch.batchId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-[#F5E6D3] transition-colors duration-150"
                  >
                    <td className="py-4 px-6 border-b border-[#E6CCB2] text-[#3E2723]">{batch.batchId}</td>
                    <td className="py-4 px-6 border-b border-[#E6CCB2] text-[#3E2723]">{batch.partner}</td>
                    <td className="py-4 px-6 border-b border-[#E6CCB2] text-[#3E2723]">{batch.note}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#3E2723] text-[#F5E6D3] py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2023 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
