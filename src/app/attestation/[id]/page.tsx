"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchAttestationById } from '../../../api/attestations';
import { NavBar } from '../../../components/NavBar';
import type { Attestation } from '../../../types/attestation';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stageNames = ['Farm', 'Processing', 'Export', 'Import', 'Roasting', 'Retail'];

export default function AttestationDetailPage() {
  const { id } = useParams();
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAttestation = async () => {
      if (id && typeof id === 'string') {
        setIsLoading(true);
        const fetchedAttestation = await fetchAttestationById(id);
        setAttestation(fetchedAttestation);
        setIsLoading(false);
      }
    };

    loadAttestation();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2C2C2C] font-sans text-[#F5F5F5]">
        <NavBar />
        <main className="flex-grow container mx-auto flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4A574]" />
        </main>
      </div>
    );
  }

  if (!attestation) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2C2C2C] font-sans text-[#F5F5F5]">
        <NavBar />
        <main className="flex-grow container mx-auto flex flex-col justify-center items-center px-4">
          <motion.div {...fadeIn} className="text-center">
            <h1 className="text-4xl font-bold text-[#D4A574] mb-6 font-poppins">Attestation Not Found</h1>
            <p className="text-[#F5F5F5] mb-8 text-lg">The attestation you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse"
              className="px-6 py-3 bg-[#D4A574] text-[#1A1A1A] rounded-lg hover:bg-[#E6BE8A] transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Back to Browse
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  const currentStage = attestation.decodedData.stage;
  const formattedDate = new Date(attestation.decodedData.timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2C2C2C] font-sans text-[#F5F5F5]">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div {...fadeIn} className="bg-[#2A2A2A] p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto">
          <div className="mb-8 w-full aspect-[21/9] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Coffee Batch Image"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#D4A574] mb-4 font-poppins">Coffee Journey</h1>
            <h2 className="text-2xl font-semibold text-[#E6BE8A] mb-2 font-poppins">Batch ID: {attestation.decodedData.batchId}</h2>
            <p className="text-lg text-[#F5F5F5] mb-4">Current Stage: {stageNames[currentStage]}</p>
            <div className="w-full bg-[#444444] rounded-full h-2.5 mb-4">
              <div
                className="bg-[#D4A574] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStage + 1) / stageNames.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-[#A0A0A0]">
              {stageNames.map((stage, index) => (
                <span key={stage} className={index <= currentStage ? 'text-[#D4A574]' : ''}>
                  {stage}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#333333] p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#D4A574] mb-2 font-poppins">Location</h3>
              <p className="text-lg text-[#F5F5F5]">{attestation.decodedData.location}</p>
            </div>
            <div className="bg-[#333333] p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#D4A574] mb-2 font-poppins">Timestamp</h3>
              <p className="text-lg text-[#F5F5F5]">{formattedDate}</p>
            </div>
          </div>

          <div className="mt-6 bg-[#333333] p-6 rounded-lg">
            <h3 className="text-xl font-medium text-[#D4A574] mb-4 font-poppins">Certifications</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {attestation.decodedData.certifications.map((cert) => (
                <span key={cert} className="bg-[#D4A574] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-semibold">
                  {cert}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-medium text-[#D4A574] mb-2 font-poppins">Details</h3>
            <p className="text-lg text-[#F5F5F5] whitespace-pre-wrap mb-6">{attestation.decodedData.details}</p>

            <h3 className="text-xl font-medium text-[#D4A574] mb-2 font-poppins">Attester</h3>
            <div className="group relative inline-block">
              <a
                href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL}/address/${attestation.decodedData.attester}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#E6BE8A] hover:text-[#D4A574] transition-colors duration-200 break-all underline"
              >
                {attestation.decodedData.attester}
              </a>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#333333] text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Click to view on block explorer
              </span>
            </div>

            <h3 className="text-xl font-medium text-[#D4A574] mt-6 mb-2 font-poppins">Transaction</h3>
            <div className="group relative inline-block">
              <a
                href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL}/tx/${attestation.txid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#E6BE8A] hover:text-[#D4A574] transition-colors duration-200 break-all underline"
              >
                {attestation.txid}
              </a>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#333333] text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Click to view transaction on block explorer
              </span>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/browse"
              className="px-8 py-4 bg-[#D4A574] text-[#1A1A1A] rounded-lg hover:bg-[#E6BE8A] transition-all duration-300 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Back to Browse
            </Link>
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