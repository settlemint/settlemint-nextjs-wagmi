"use client"

import { useEffect, useState } from "react";
import { fetchAttestations } from "../../api/attestations";
import { AttestationsTable } from "../../components/AttestationsTable";
import { NavBar } from "../../components/NavBar";
import type { Attestation } from "../../types/attestation";

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
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] font-light">
      <NavBar />
      <main className="flex-grow container mx-auto my-12 px-4">
        <h1 className="text-3xl font-semibold text-white mb-6">Browse Attestations</h1>
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
      </main>

      <footer className="bg-[#333333] text-white py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}