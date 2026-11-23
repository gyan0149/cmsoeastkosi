import { useTeachers } from "../data/teachers";
import { useLang } from "../i18n";
import { useSchool } from "../schoolContext";
import type { StaffRole } from "./staff";

export function useRoleLabel(role: StaffRole | null): string {
  const school = useSchool();
  const { t } = useLang();
  const [teachers] = useTeachers(school.udise);
  if (role === "principal") return t("Principal", "प्रधानाध्यापक");
  const incharge = teachers.find((x) => x.incharge);
  return `${t("Website in-charge", "वेबसाइट प्रभारी")}${incharge ? ` (${incharge.name})` : ""}`;
}
