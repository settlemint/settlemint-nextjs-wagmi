import type React from 'react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { createAttestation } from '../api/attestations';

interface AttestationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AttestationModal: React.FC<AttestationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [batchId, setBatchId] = useState('');
  const [stage, setStage] = useState(0);
  const [location, setLocation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { address } = useAccount();

  useEffect(() => {
    setIsFormValid(
      batchId.trim() !== '' &&
      location.trim() !== '' &&
      certifications.trim() !== '' &&
      details.trim() !== ''
    );
  }, [batchId, location, certifications, details]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked");
    if (!address || !isFormValid) {
      console.log("Form is not valid or address is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting to create attestation", { batchId, stage, location, certifications, details, address });
      await createAttestation(batchId, stage, location, certifications, details, address);
      console.log("Attestation created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating attestation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">Create Attestation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="batchId" className="block text-sm font-medium text-gray-300 mb-1">
              Batch ID
            </label>
            <input
              type="text"
              id="batchId"
              className="w-full bg-[#333333] text-white p-2 rounded"
              placeholder="Enter batch ID"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stage" className="block text-sm font-medium text-gray-300 mb-1">
              Stage
            </label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(Number(e.target.value))}
              className="w-full bg-[#333333] text-white p-2 rounded"
              disabled={isSubmitting}
            >
              {["Farm", "Processing", "Export", "Import", "Roasting", "Retail"].map((stageName, index) => (
                <option key={stageName} value={index}>{stageName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#333333] text-white p-2 rounded"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-300 mb-1">
              Certifications
            </label>
            <input
              type="text"
              id="certifications"
              placeholder="Certifications (comma-separated)"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              className="w-full bg-[#333333] text-white p-2 rounded"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">
              Details
            </label>
            <textarea
              id="details"
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-[#333333] text-white p-2 rounded"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-white rounded transition-colors duration-200 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`px-4 py-2 text-white rounded transition-colors duration-200 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : (isFormValid ? 'bg-[#8B4513] hover:bg-[#A0522D]' : 'bg-gray-400 cursor-not-allowed')
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Create Attestation'}
            </button>
          </div>
        </form>
        {isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="text-white text-xl">Creating attestation...</div>
          </div>
        )}
      </div>
    </div>
  );
};