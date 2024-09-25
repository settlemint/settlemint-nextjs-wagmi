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
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  rowsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  defaultFilterColumn?: string;
  defaultFilterValue?: string;
}

const prettyColumnNames: { [key: string]: string } = {
  batchId: "Batch ID",
  timestamp: "Timestamp",
  attester: "Attester",
  stage: "Stage",
  location: "Location",
  certifications: "Certifications",
  details: "Details",
  previousAttestationId: "Previous Attestation ID"
};

const getPrettyColumnName = (column: string): string => {
  return prettyColumnNames[column] || column;
};

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

export const AttestationsTable: React.FC<AttestationsTableProps> = ({
  attestations,
  columns,
  enableSorting = false,
  enableFiltering = false,
  enablePagination = false,
  rowsPerPage = 5,
  defaultSortColumn = "",
  defaultSortDirection = "asc",
  defaultFilterColumn = "",
  defaultFilterValue = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterColumn, setFilterColumn] = useState(defaultFilterColumn);
  const [filterValue, setFilterValue] = useState(defaultFilterValue);
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);
  const [itemsPerPage, setItemsPerPage] = useState(rowsPerPage);

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
      {(enableFiltering || enableSorting) && (
        <div className="flex justify-between mb-4">
          {enableFiltering && (
            <div className="flex space-x-2">
              <select
                className="bg-[#333333] text-white p-2 rounded text-sm"
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                <option value="">Filter column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>{getPrettyColumnName(column)}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Filter value"
                className="bg-[#333333] text-white p-2 rounded text-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
          )}
          {enableSorting && (
            <div className="flex space-x-2">
              <select
                className="bg-[#333333] text-white p-2 rounded text-sm"
                value={sortColumn}
                onChange={(e) => setSortColumn(e.target.value)}
              >
                <option value="">Sort column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>{getPrettyColumnName(column)}</option>
                ))}
              </select>
              <button
                className="bg-[#333333] text-white p-2 rounded text-sm"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                type="button"
              >
                {sortDirection === "asc" ? "Asc ▲" : "Desc ▼"}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow-xl">
        <table className="w-full bg-[#2A2A2A] text-white table-fixed">
          <thead>
            <tr className="bg-[#333333] text-white">
              <th className="py-4 px-3 text-left w-36 truncate">ID</th>
              {columns.map((column) => (
                <th key={column} className="py-4 px-3 text-left w-40 truncate">{getPrettyColumnName(column)}</th>
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
      {enablePagination && (
        <div className="mt-4 flex justify-between items-center text-white">
          <button
            className="bg-[#333333] p-2 rounded text-sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            type="button"
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <select
            className="bg-[#333333] text-white p-2 rounded text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="5">5 rows</option>
            <option value="10">10 rows</option>
            <option value="25">25 rows</option>
            <option value="50">50 rows</option>
          </select>
          <button
            className="bg-[#333333] p-2 rounded text-sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            type="button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};