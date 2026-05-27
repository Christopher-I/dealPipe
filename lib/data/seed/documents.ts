import type { DocumentRef } from "@/types/domain";
import { daysAgo, intBetween, mulberry32, pick } from "./_lib";
import { DEALS } from "./deals";
import { listUsersForOrg } from "./users";

const DOC_NAMES = [
  "Offering Memorandum.pdf",
  "Rent Roll.xlsx",
  "T-12.xlsx",
  "Title Commitment.pdf",
  "Survey.pdf",
  "Inspection Report.pdf",
  "PSA Draft.pdf",
  "Lender Term Sheet.pdf",
  "Property Photos.zip",
  "Environmental Report.pdf",
];

function generateDocsForDeal(
  dealId: string,
  orgId: string,
  rngSeed: number,
): DocumentRef[] {
  const rng = mulberry32(rngSeed);
  const users = listUsersForOrg(orgId);
  if (!users.length) return [];

  const total = intBetween(rng, 2, 4);
  const out: DocumentRef[] = [];

  for (let i = 0; i < total; i++) {
    const filename = pick(rng, DOC_NAMES);
    const uploader = pick(rng, users);
    const isPdf = filename.endsWith(".pdf");
    const isZip = filename.endsWith(".zip");
    out.push({
      id: `doc_${dealId}_${i}`,
      orgId,
      dealId,
      storagePath: `mock://${orgId}/${dealId}/${i}-${filename}`,
      filename,
      mimeType: isPdf
        ? "application/pdf"
        : isZip
          ? "application/zip"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: intBetween(rng, 80_000, 8_000_000),
      uploadedBy: uploader.id,
      createdAt: daysAgo(intBetween(rng, 5, 160)),
    });
  }
  return out;
}

export const DOCUMENTS: DocumentRef[] = DEALS.flatMap((d, i) =>
  generateDocsForDeal(d.id, d.orgId, 12_000 + i),
);

export function listDocumentsForDeal(dealId: string): DocumentRef[] {
  return DOCUMENTS.filter((d) => d.dealId === dealId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
