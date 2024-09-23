import { format } from 'date-fns';
import { motion } from "framer-motion";
import type React from 'react';
import { useState } from 'react';

interface DecodedData {
  batchId: string;
  timestamp: number;
  attester: string;
  stage: number;
  location: string;
  certifications: string[];
  details: string;
  previousAttestationId: string;
}

interface Attestation {
  id: string;
  decodedData: DecodedData;
}

interface AttestationsTableProps {
  attestations: Attestation[];
  columns: string[];
}

const renderValue = (key: string, value: unknown): React.ReactNode => {
  if (key === 'timestamp' && typeof value === 'number') {
    return format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss');
  }
  if (typeof value === 'object' && value !== null) {
    if ('hex' in value && typeof value.hex === 'string') {
      return value.hex;
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
};

export const AttestationsTable: React.FC<AttestationsTableProps> = ({ attestations, columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 5;

  const filteredAttestations = attestations.filter(attestation => {
    if (!filterColumn || !filterValue) return true;
    const value = attestation.decodedData[filterColumn as keyof DecodedData];
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  });

  const sortedAttestations = [...filteredAttestations].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a.decodedData[sortColumn as keyof DecodedData];
    const bValue = b.decodedData[sortColumn as keyof DecodedData];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedAttestations = sortedAttestations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAttestations.length / itemsPerPage);

  return (
    <div>
      <div className="mb-4 flex space-x-4">
        <select
          className="bg-[#333333] text-white p-2 rounded"
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
        >
          <option value="">Select column to filter</option>
          {columns.map((column) => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter value"
          className="bg-[#333333] text-white p-2 rounded"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <select
          className="bg-[#333333] text-white p-2 rounded"
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value)}
        >
          <option value="">Select column to sort</option>
          {columns.map((column) => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
        <button
          className="bg-[#333333] text-white p-2 rounded"
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          type="button"
        >
          {sortDirection === "asc" ? "▲" : "▼"}
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-xl">
        <table className="w-full bg-[#2A2A2A] text-white table-fixed">
          <thead>
            <tr className="bg-[#333333] text-white">
              <th className="py-4 px-3 text-left w-36 truncate">ID</th>
              {columns.map((column) => (
                <th key={column} className="py-4 px-3 text-left w-40 truncate">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedAttestations.map((attestation, index) => (
              <motion.tr
                key={attestation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-[#3A3A3A] transition-colors duration-150"
              >
                <td className="py-3 px-3 border-b border-[#444444] truncate">
                  <div className="whitespace-nowrap overflow-hidden overflow-ellipsis" title={attestation.id}>
                    {`${attestation.id.slice(0, 8)}...${attestation.id.slice(-6)}`}
                  </div>
                </td>
                {columns.map((column) => (
                  <td key={column} className="py-3 px-3 border-b border-[#444444] truncate">
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis" title={String(attestation.decodedData[column as keyof DecodedData])}>
                      {renderValue(column, attestation.decodedData[column as keyof DecodedData] as React.ReactNode)}
                    </div>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-white">
        <button
          className="bg-[#333333] p-2 rounded"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          type="button"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="bg-[#333333] p-2 rounded"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};