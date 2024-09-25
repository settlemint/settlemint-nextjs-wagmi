import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import type { Attestation, RawAttestation } from "../types/attestation";
import { parseDecodedData } from "../utils/attestationHelpers";
import { AUTH_TOKEN, EAS_CONTRACT_ADDRESS, EAS_INDEXER_URL, SCHEMA_ID } from "../utils/constants";

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

export const fetchAttestations = async (): Promise<Attestation[]> => {
  try {
    const data = await graphqlClient.request<{ attestations: RawAttestation[] }>(ATTESTATIONS_QUERY, {
      schemaId: SCHEMA_ID,
    });

    if (!data || !data.attestations || !Array.isArray(data.attestations)) {
      console.error("Invalid API response structure:", data);
      return [];
    }

    return data.attestations
      .map((attestation) => {
        try {
          if (!attestation.decodedDataJson) {
            console.warn("Empty decodedDataJson for attestation:", attestation);
            return null;
          }
          const parsedData = JSON.parse(attestation.decodedDataJson);
          return {
            id: attestation.id,
            decodedData: parseDecodedData(parsedData),
          };
        } catch (parseError) {
          console.error("Error parsing attestation:", attestation, parseError);
          return null;
        }
      })
      .filter((attestation): attestation is Attestation => attestation !== null);
  } catch (error) {
    console.error("Error fetching attestations:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
};

export const createAttestation = async (
  batchId: string,
  stage: number,
  location: string,
  certifications: string,
  details: string,
  address: string,
) => {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  eas.connect(signer);

  const schemaEncoder = new SchemaEncoder(
    "string batchId, uint256 timestamp, address attester, uint8 stage, string location, string[] certifications, string details, bytes32 previousAttestationId",
  );
  const timestamp = Math.floor(Date.now() / 1000);
  const encodedData = schemaEncoder.encodeData([
    { name: "batchId", value: batchId, type: "string" },
    { name: "timestamp", value: timestamp, type: "uint256" },
    { name: "attester", value: address, type: "address" },
    { name: "stage", value: stage, type: "uint8" },
    { name: "location", value: location, type: "string" },
    { name: "certifications", value: certifications.split(","), type: "string[]" },
    { name: "details", value: details, type: "string" },
    {
      name: "previousAttestationId",
      value: "0x0000000000000000000000000000000000000000000000000000000000000000",
      type: "bytes32",
    },
  ]);

  const tx = await eas.attest({
    schema: SCHEMA_ID,
    data: {
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);

  const attestation = await eas.getAttestation(receipt);
  console.log("Attestation details:", attestation);

  return attestation;
};