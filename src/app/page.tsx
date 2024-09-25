"use client"

import { motion } from "framer-motion";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchAttestations } from "../api/attestations";
import { AttestationModal } from "../components/AttestationModal";
import { AttestationsTable } from "../components/AttestationsTable";
import { NavBar } from "../components/NavBar";
import type { Attestation } from "../types/attestation";

// Component
export default function Home() {
  const { status: accountStatus } = useAccount();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAttestations = useCallback(async () => {
    const fetchedAttestations = await fetchAttestations();
    // Sort attestations by timestamp in descending order
    const sortedAttestations = fetchedAttestations.sort((a, b) =>
      b.decodedData.timestamp - a.decodedData.timestamp
    );
    setAttestations(sortedAttestations);

    if (sortedAttestations.length > 0) {
      setColumns(Object.keys(sortedAttestations[0].decodedData));
    }
  }, []);

  useEffect(() => {
    loadAttestations();
  }, [loadAttestations]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAttestationCreated = () => {
    loadAttestations();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] font-light">
      <Head>
        <title>Coffee Batch Tracker</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <NavBar />

      <div className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1690983331198-b32a245b13cc?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container mx-auto flex flex-col justify-center h-full relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-6xl font-extrabold tracking-tight">
              Coffee Beans Tracker
            </h1>
            <p className="text-lg mt-4 opacity-80">
              Track the journey of your coffee beans from farm to cup. Ensure every sip you take supports ethical and sustainable practices.
            </p>
            <button type="button" className="mt-6 px-8 py-3 bg-[#333333] text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              Find Your Beans
            </button>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow container mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Recent Attestations
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#A0522D] transition-colors duration-200"
            >
              Create Attestation
            </button>
          </div>
          <AttestationsTable
            attestations={attestations}
            columns={columns}
            enableSorting={false}
            enableFiltering={false}
            enablePagination={false}
            rowsPerPage={5}
            defaultSortColumn="timestamp"
            defaultSortDirection="desc"
          />
        </motion.div>
      </main>

      <AttestationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleAttestationCreated}
      />

      <footer className="bg-[#333333] text-white py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
