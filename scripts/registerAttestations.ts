import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const EAS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS;
const BLOCKCHAIN_NODE = `${process.env.NEXT_PUBLIC_BLOCKCHAIN_NODE}/${process.env.NEXT_PUBLIC_AUTH_TOKEN}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SCHEMA_UID = process.env.NEXT_PUBLIC_SCHEMA_UID; // Make sure this is set to your actual schema UID

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

const countries = {
  production: ["Colombia", "Brazil", "Ethiopia", "Vietnam", "Indonesia"],
  processing: ["Colombia", "Brazil", "Ethiopia", "Vietnam", "Indonesia"],
  export: ["Colombia", "Brazil", "Ethiopia", "Vietnam", "Indonesia"],
  import: ["USA", "Germany", "Japan", "Italy", "Canada"],
  roasting: ["USA", "Germany", "Japan", "Italy", "Canada"],
  retail: ["USA", "Germany", "Japan", "Italy", "Canada", "UK", "France", "Australia"],
};

const cities = {
  Colombia: ["Bogotá", "Medellín", "Cali"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Belo Horizonte"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Bahir Dar"],
  Vietnam: ["Ho Chi Minh City", "Hanoi", "Da Nang"],
  Indonesia: ["Jakarta", "Surabaya", "Bandung"],
  USA: ["Seattle", "New York", "San Francisco"],
  Germany: ["Berlin", "Hamburg", "Munich"],
  Japan: ["Tokyo", "Osaka", "Kyoto"],
  Italy: ["Rome", "Milan", "Florence"],
  Canada: ["Toronto", "Vancouver", "Montreal"],
  UK: ["London", "Manchester", "Edinburgh"],
  France: ["Paris", "Lyon", "Marseille"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
};

const stages = ["Farm", "Processing", "Export", "Import", "Roasting", "Retail"];

function generateBatchId() {
  const year = new Date().getFullYear();
  const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
  const randomNumbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${year}-${randomLetters}-${randomNumbers}`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomCity(country: string): string {
  return getRandomElement(cities[country as keyof typeof cities] || []);
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
  originCountry: string,
  originCity: string,
  destinationCountry: string,
  destinationCity: string,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  let location: string;

  if (stage <= 2) {
    location = `${originCity}, ${originCountry}`;
  } else if (stage >= 3) {
    location = `${destinationCity}, ${destinationCountry}`;
  } else {
    location = stage === 2 ? `${originCity}, ${originCountry}` : `${destinationCity}, ${destinationCountry}`;
  }

  const certifications = ["Organic", "Fair Trade", "Rainforest Alliance", "UTZ Certified", "Bird Friendly"];
  const selectedCertifications = certifications.slice(0, Math.floor(Math.random() * 4) + 1);
  const details = `Details for ${stages[stage]} stage of batch ${batchId} in ${location}`;

  const encodedData = schemaEncoder.encodeData([
    { name: "batchId", value: batchId, type: "string" },
    { name: "timestamp", value: timestamp, type: "uint256" },
    { name: "attester", value: attesterAddress, type: "address" },
    { name: "stage", value: stage, type: "uint8" },
    { name: "location", value: location, type: "string" },
    { name: "certifications", value: selectedCertifications, type: "string[]" },
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
      const batchId = generateBatchId();
      let previousAttestationId = ethers.ZeroHash;
      const originCountry = getRandomElement(countries.production);
      const originCity = getRandomCity(originCountry);
      const destinationCountry = getRandomElement(countries.import);
      const destinationCity = getRandomCity(destinationCountry);

      for (let stage = 0; stage < 6; stage++) {
        const uid = await createAttestation(
          eas,
          schemaEncoder,
          batchId,
          stage,
          previousAttestationId,
          signer.address,
          originCountry,
          originCity,
          destinationCountry,
          destinationCity,
        );
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
    const attestationCount = 5; // This will create 2 complete coffee journeys, each with 6 stages
    const attestations = await registerMultipleAttestations(attestationCount);
    console.log(`Registered ${attestations.length} attestations`);
  } catch (error) {
    console.error("Failed to register attestations:", error);
  }
}

if (require.main === module) {
  main();
}


