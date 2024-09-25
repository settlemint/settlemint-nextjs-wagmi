import { useState } from 'react';
import { useAccount } from 'wagmi';
import { createAttestation } from '../api/attestations';

interface AttestationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttestationModal({ isOpen, onClose }: AttestationModalProps) {
  const [batchId, setBatchId] = useState('');
  const [stage, setStage] = useState(0);
  const [location, setLocation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsSubmitting(true);
    try {
      if (!batchId || !location || !certifications || !details) {
        throw new Error("All fields are required.");
      }

      await createAttestation(batchId, stage, location, certifications, details, address);
      onClose();
    } catch (error) {
      console.error("Error creating attestation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Attestation</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full p-2 mb-2 border rounded text-gray-800"
          />
          <select
            value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            className="w-full p-2 mb-2 border rounded text-gray-800"
          >
            {["Farm", "Processing", "Export", "Import", "Roasting", "Retail"].map((stageName, index) => (
              <option key={stageName} value={index}>{stageName}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 mb-2 border rounded text-gray-800"
          />
          <input
            type="text"
            placeholder="Certifications (comma-separated)"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            className="w-full p-2 mb-2 border rounded text-gray-800"
          />
          <textarea
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-2 mb-2 border rounded text-gray-800"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Create Attestation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}