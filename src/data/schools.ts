// School data for this website (source: HM contact list).
import type { School, SchoolBase, SchoolExtra } from "../types/school";

// The school this website belongs to.
export const SITE_UDISE = "20180409703";

export const SCHOOL_LIST: SchoolBase[] = [
  { slNo: 74, udise: "20180409703", district: "Purbi Singhbhum", block: "Dumaria", name: "CM SoE UPG GOVT +2S ASTKOSI, BHALUK PATRA", classFrom: 1, classTo: 12, hmName: "Abhay Kumar Singh", hmPhone: "9801502100" },
];

const EXTRAS: Record<string, SchoolExtra> = {};

export const SCHOOLS: School[] = SCHOOL_LIST.map((s) => ({ ...s, ...EXTRAS[s.udise] }));

const BY_UDISE = new Map(SCHOOLS.map((s) => [s.udise, s]));

export function getSchool(udise: string | undefined): School | undefined {
  return udise ? BY_UDISE.get(udise) : undefined;
}

export function classesLabel(s: School): string {
  return `Class ${s.classFrom} to ${s.classTo}`;
}

export function schoolLevel(s: School): string {
  return s.classTo >= 12 ? "Senior Secondary (up to Class 12)" : "Secondary (up to Class 10)";
}

export function schoolAddress(s: School): string {
  const parts = [s.village, `Block ${s.block}`, `District ${s.district}`, "Jharkhand"].filter(Boolean);
  return parts.join(", ") + (s.pinCode ? ` – ${s.pinCode}` : "");
}

export function principalLabel(s: School): string {
  return s.hmName ?? "Headmaster";
}

export function displayPhone(phone: string): string {
  return `${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export function mapQuery(s: School): string {
  return s.coords ? `${s.coords.lat},${s.coords.lng}` : `${s.name}, ${s.block}, ${s.district}, Jharkhand`;
}

export function mapEmbedUrl(s: School): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery(s))}&z=${s.coords ? 15 : 13}&output=embed`;
}

export function mapLink(s: School): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(s))}`;
}

export function imageUrl(file: string): string {
  return `${import.meta.env.BASE_URL}images/${file}`;
}
