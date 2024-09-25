"use client"

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'; // Add this import
import { fetchAttestations } from "../../api/attestations";
import { AttestationModal } from "../../components/AttestationModal"; // Change this import
import { AttestationsTable } from "../../components/AttestationsTable";
import { CreateAttestationButton } from "../../components/CreateAttestationButton";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount(); // Add this line

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

  const handleCreateAttestation = (newAttestation: Attestation) => {
    setAttestations([newAttestation, ...attestations]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A] font-sans text-[#F5F5F5]">
      <NavBar />
      <main className="flex-grow container mx-auto my-12 px-4">
        <motion.div {...fadeIn}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#D4A574] font-poppins">Browse Attestations</h1>
            <CreateAttestationButton onClick={() => setIsModalOpen(true)} />
          </div>
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

      <AttestationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAttestation}
        mode="create"
      />

      <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 Coffee Batch Tracker. All rights reserved.</p>
          <p className="mt-2 text-sm opacity-75">Ensuring transparency and sustainability in every cup.</p>
        </div>
      </footer>
    </div>
  );
}