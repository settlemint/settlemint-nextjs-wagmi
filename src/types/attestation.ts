export interface DecodedData {
  batchId: string;
  timestamp: number;
  attester: string;
  stage: number;
  location: string;
  certifications: string[];
  details: string;
  previousAttestationId: string;
}

export interface Attestation {
  id: string;
  decodedData: DecodedData;
}

export interface RawAttestation {
  id: string;
  decodedDataJson: string;
}