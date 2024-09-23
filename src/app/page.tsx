"use client"

import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import { GraphQLClient, gql } from "graphql-request";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { AttestationsTable } from "../components/AttestationsTable";
import type { Attestation, DecodedData, RawAttestation } from "../types/attestation";

// Constants
const EAS_INDEXER_URL = process.env.NEXT_PUBLIC_EAS_INDEXER_URL || '';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';
const SCHEMA_ID = "0xb63b9100d7506fe1cf467ce00a75e802c02214ad2a632e647a62628184b1c472";

// GraphQL setup
const graphqlClient = new GraphQLClient(EAS_INDEXER_URL, {
  headers: { "x-auth-token": AUTH_TOKEN },
});

const ATTESTATIONS_QUERY = gql`
  query FetchAttestations($schemaId: String!) {
    attestations(where: { schemaId: { equals: $schemaId } }) {
      id
      decodedDataJson
    }
  }
`;

// Helper functions
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const parseDecodedData = (data: any[]): DecodedData => {
  const result: Partial<DecodedData> = {};
  const stages = ["Farm", "Processing", "Export", "Import", "Roasting", "Retail"];

  for (const { name, value } of data) {
    switch (name) {
      case "timestamp":
        result.timestamp = value.value.hex ? Number.parseInt(value.value.hex, 16) : undefined;
        break;
      case "stage":
        result.stage = typeof value.value === 'number' ? value.value : stages.indexOf(value.value);
        break;
      case "batchId":
      case "attester":
      case "location":
      case "certifications":
      case "details":
      case "previousAttestationId":
        result[name as keyof DecodedData] = value.value;
        break;
    }
  }

  return result as DecodedData;
};

const fetchAttestations = async (): Promise<Attestation[]> => {
  try {
    const data = await graphqlClient.request<{ attestations: RawAttestation[] }>(ATTESTATIONS_QUERY, { schemaId: SCHEMA_ID });
    return data.attestations.map(attestation => ({
      id: attestation.id,
      decodedData: parseDecodedData(JSON.parse(attestation.decodedDataJson))
    }));
  } catch (error) {
    console.error("Error fetching attestations:", error);
    return [];
  }
};

// Component
export default function Home() {
  const { status: accountStatus } = useAccount();
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
      <Head>
        <title>Coffee Batch Tracker</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <header className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1690983331198-b32a245b13cc?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <nav className="absolute top-0 left-0 right-0 bg-[#1A1A1A] bg-opacity-80 p-4 shadow-lg z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">Home</a>
              <a href="/about" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">About</a>
              <a href="/blog" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">All Batches</a>
            </div>
            <div className="flex items-center space-x-4">
              <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg bg-transparent" />
              <ConnectKitButton />
            </div>
          </div>
        </nav>
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
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
      </header>

      <main className="flex-grow container mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Recent Attestations
          </h2>
          <AttestationsTable attestations={attestations} columns={columns} />
        </motion.div>
      </main>

      <footer className="bg-[#333333] text-white py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
