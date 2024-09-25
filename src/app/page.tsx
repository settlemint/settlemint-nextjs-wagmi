"use client"

import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchAttestations } from "../api/attestations";
import { AttestationModal } from "../components/AttestationModal";
import { AttestationsTable } from "../components/AttestationsTable";
import { NavBar } from "../components/NavBar";
import type { Attestation } from "../types/attestation";

export default function Home() {
  const { status: accountStatus } = useAccount();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAttestations = useCallback(async () => {
    const fetchedAttestations = await fetchAttestations();
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

  const handleModalClose = () => setIsModalOpen(false);
  const handleAttestationCreated = () => {
    loadAttestations();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2C2C2C] font-light text-gray-100">
      <Head>
        <title>Coffee Batch Tracker</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <NavBar />

      <div className="relative bg-cover bg-center h-[70vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1690983331198-b32a245b13cc?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="container mx-auto flex flex-col justify-center h-full relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-6xl font-extrabold tracking-tight mb-4">
              Coffee Beans Tracker
            </h1>
            <p className="text-xl mt-4 opacity-90 leading-relaxed">
              Track the journey of your coffee beans from farm to cup. Ensure every sip you take supports ethical and sustainable practices.
            </p>
            <Link href="/browse" className="inline-block mt-8 px-8 py-3 bg-[#D4A574] text-[#1A1A1A] rounded-lg hover:bg-[#E6BE8A] transition-colors duration-200 text-lg font-semibold">
              Explore Coffee Journeys
            </Link>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow container mx-auto my-16 px-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 bg-[#2A2A2A] p-8 rounded-lg shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-[#D4A574] mb-6">Coffee Journey Tracking</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#333333] p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-[#D4A574] mb-4">What We Track</h3>
              <ul className="space-y-3 text-gray-200">
                {["Batch ID", "Processing Stage", "Location", "Certifications", "Timestamp", "Details"].map((item) => (
                  <li key={item} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#D4A574]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#333333] p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-[#D4A574] mb-4">How to Use</h3>
              <p className="text-gray-200 mb-4 leading-relaxed">
                Explore recent attestations below to see the latest updates on coffee batches. Each entry represents a step in a coffee batch's journey.
              </p>
              <p className="text-gray-200 mb-4 leading-relaxed">
                For a comprehensive view with advanced sorting and filtering, visit our <Link href="/browse" className="text-[#D4A574] hover:underline font-semibold">Browse page</Link>.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Part of the coffee supply chain? Contribute by adding new attestations using the "Create Attestation" button.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#D4A574]">
              Recent Attestations
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#D4A574] text-[#1A1A1A] rounded-lg hover:bg-[#E6BE8A] transition-colors duration-200 text-lg font-semibold"
            >
              Create Attestation
            </button>
          </div>
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-xl">
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
          </div>
        </motion.div>
      </main>

      <AttestationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleAttestationCreated}
      />

      <footer className="bg-[#1A1A1A] text-gray-400 py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 Coffee Batch Tracker. All rights reserved.</p>
          <p className="mt-2 text-sm">Ensuring transparency and sustainability in every cup.</p>
        </div>
      </footer>
    </div>
  );
}
