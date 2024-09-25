"use client"

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAttestations } from "../../api/attestations";
import { AttestationsTable } from "../../components/AttestationsTable";
import { NavBar } from "../../components/NavBar";
import type { Attestation } from "../../types/attestation";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BrowsePage() {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    const loadAttestations = async () => {
      const fetchedAttestations = await fetchAttestations();
      setAttestations(fetchedAttestations);

      if (fetchedAttestations.length > 0) {
        setColumns(Object.keys(fetchedAttestations[0].decodedData));
      }
    };

    loadAttestations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A] font-sans text-[#F5F5F5]">
      <NavBar />
      <main className="flex-grow container mx-auto my-12 px-4">
        <motion.div {...fadeIn}>
          <h1 className="text-4xl font-bold text-[#D4A574] mb-6 font-poppins">Browse Attestations</h1>
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-xl">
            <AttestationsTable
              attestations={attestations}
              columns={columns}
              enableSorting={true}
              enableFiltering={true}
              enablePagination={true}
              rowsPerPage={25}
              defaultSortColumn="timestamp"
              defaultSortDirection="desc"
            />
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 Coffee Batch Tracker. All rights reserved.</p>
          <p className="mt-2 text-sm opacity-75">Ensuring transparency and sustainability in every cup.</p>
        </div>
      </footer>
    </div>
  );
}