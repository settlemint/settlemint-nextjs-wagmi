import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const EAS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS;
const BLOCKCHAIN_NODE = `${process.env.BLOCKCHAIN_NODE}/${process.env.BTP_TOKEN}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SCHEMA_UID = process.env.SCHEMA_UID; // Make sure this is set to your actual schema UID

interface AttestationDetails {
  uid: string;
  schema: string;
  recipient: string;
  attester: string;
  time: number;
  expirationTime: number;
  revocationTime: number;
  refUID: string;
  revocable: boolean;
  data: string;
}

async function initializeEAS() {
  if (!EAS_CONTRACT_ADDRESS || !BLOCKCHAIN_NODE || !PRIVATE_KEY) {
    throw new Error("Missing required environment variables");
  }

  const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_NODE);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  return { eas, signer };
}

async function createAttestation(
  eas: EAS,
  schemaEncoder: SchemaEncoder,
  batchId: string,
  stage: number,
  previousAttestationId: string,
  attesterAddress: string,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const stages = ["Farm", "Processing", "Export", "Import", "Roasting", "Retail"];
  const locations = ["Colombia", "Colombia", "Colombia", "USA", "USA", "USA"];
  const certifications = ["Organic", "Fair Trade", "Rainforest Alliance"];
  const details = `Details for ${stages[stage]} stage of batch ${batchId}`;

  const encodedData = schemaEncoder.encodeData([
    { name: "batchId", value: batchId, type: "string" },
    { name: "timestamp", value: timestamp, type: "uint256" },
    { name: "attester", value: attesterAddress, type: "address" },
    { name: "stage", value: stage, type: "uint8" },
    { name: "location", value: locations[stage], type: "string" },
    { name: "certifications", value: certifications.slice(0, stage + 1), type: "string[]" },
    { name: "details", value: details, type: "string" },
    { name: "previousAttestationId", value: previousAttestationId, type: "bytes32" },
  ]);

  const tx = await eas.attest({
    schema: SCHEMA_UID ?? "",
    data: {
      recipient: ethers.ZeroAddress,
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();
  console.log(`Attestation ${stage + 1} created with UID: ${newAttestationUID}`);
  return newAttestationUID;
}

async function getAttestationDetails(eas: EAS, uid: string): Promise<AttestationDetails> {
  const attestation = await eas.getAttestation(uid);
  return {
    uid: uid,
    schema: attestation.schema,
    recipient: attestation.recipient,
    attester: attestation.attester,
    time: Number(attestation.time),
    expirationTime: Number(attestation.expirationTime),
    revocationTime: Number(attestation.revocationTime),
    refUID: attestation.refUID,
    revocable: attestation.revocable,
    data: attestation.data,
  };
}

function writeAttestationDetailsToFile(attestationDetails: AttestationDetails[]) {
  const filePath = join(process.cwd(), "attestation-details.json");
  writeFileSync(filePath, JSON.stringify(attestationDetails, null, 2));
  console.log(`Attestation details written to ${filePath}`);
}

export async function registerMultipleAttestations(count: number) {
  try {
    const { eas, signer } = await initializeEAS();
    const schemaEncoder = new SchemaEncoder(
      "string batchId, uint256 timestamp, address attester, uint8 stage, string location, string[] certifications, string details, bytes32 previousAttestationId",
    );
    const attestationDetails: AttestationDetails[] = [];

    for (let i = 0; i < count; i++) {
      const batchId = `BATCH-B-${i + 1}`;
      let previousAttestationId = ethers.ZeroHash;

      for (let stage = 0; stage < 6; stage++) {
        const uid = await createAttestation(eas, schemaEncoder, batchId, stage, previousAttestationId, signer.address);
        const details = await getAttestationDetails(eas, uid);
        attestationDetails.push(details);
        previousAttestationId = uid;
      }
    }

    writeAttestationDetailsToFile(attestationDetails);
    return attestationDetails;
  } catch (error) {
    console.error("Error registering attestations:", error);
    throw error;
  }
}

async function main() {
  try {
    const attestationCount = 20; // This will create 2 complete coffee journeys, each with 6 stages
    const attestations = await registerMultipleAttestations(attestationCount);
    console.log(`Registered ${attestations.length} attestations`);
  } catch (error) {
    console.error("Failed to register attestations:", error);
  }
}

if (require.main === module) {
  main();
}


