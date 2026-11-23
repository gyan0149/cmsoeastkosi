import { useState, type FormEvent } from "react";
import { PrincipalAvatar } from "../components/PrincipalAvatar";
import { SchoolPageHeader } from "../components/SchoolPageHeader";
import { PageBody, Section } from "../components/ui";
import { newId, photoToDataUrl } from "../data/localStore";
import { principalLabel } from "../data/schools";
import { useTeachers, type Teacher } from "../data/teachers";
import { useLang } from "../i18n";
import { useSchool } from "../schoolContext";
import { StaffOnly } from "../staff/StaffLogin";
import { useStaffRole } from "../staff/staff";

const input = "w-full rounded-md border border-slate-300 px-3 py-2.5 text-base focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none";
const EMPTY: Omit<Teacher, "id"> = { name: "", designation: "", subject: "", qualification: "", experience: "" };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^\p{L}/u.test(w) && !/^(dr|shri|smt|md|mr|mrs|ms)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function TeacherForm({ initial, onSave, onCancel }: { initial: Omit<Teacher, "id">; onSave: (t: Omit<Teacher, "id">) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [v, setV] = useState(initial);
  const set = (k: keyof Teacher) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });

  async function pickPhoto(file?: File) {
    if (!file) return;
    try {
      setV({ ...v, photo: await photoToDataUrl(file) });
    } catch {
      alert(t("Could not read this photo.", "यह फ़ोटो नहीं खुल पाई।"));
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({ ...v, name: v.name.trim(), designation: v.designation.trim(), subject: v.subject.trim() });
  }

  return (
    <form onSubmit={submit} className="animate-fade-up space-y-4 rounded-xl border-2 border-brand-600 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Name", "नाम")} *</span>
          <input required value={v.name} onChange={set("name")} className={input} placeholder="Smt. / Shri ..." />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Designation", "पद")} *</span>
          <input required value={v.designation} onChange={set("designation")} className={input} placeholder={t("e.g. PGT, TGT, Assistant Teacher", "जैसे: PGT, TGT, सहायक शिक्षक")} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Subject(s)", "विषय")} *</span>
          <input required value={v.subject} onChange={set("subject")} className={input} placeholder={t("e.g. Mathematics", "जैसे: गणित")} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Qualification", "योग्यता")}</span>
          <input value={v.qualification ?? ""} onChange={set("qualification")} className={input} placeholder="M.Sc., B.Ed." />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Experience", "अनुभव")}</span>
          <input value={v.experience ?? ""} onChange={set("experience")} className={input} placeholder={t("e.g. 8 years", "जैसे: 8 वर्ष")} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Photo", "फ़ोटो")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => void pickPhoto(e.target.files?.[0])}
            className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:font-semibold file:text-brand-700"
          />
          {v.photo && <img src={v.photo} alt="" className="mt-2 h-16 w-16 rounded-full object-cover" />}
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="flex-1 rounded-md bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
          ✓ {t("Save", "सेव करें")}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md px-5 py-3 font-semibold text-slate-600 ring-1 ring-slate-300">
          {t("Cancel", "रद्द")}
        </button>
      </div>
    </form>
  );
}

function Card({ teacher, children }: { teacher: Pick<Teacher, "name" | "photo" | "designation" | "subject" | "qualification" | "experience" | "incharge">; children?: React.ReactNode }) {
  const { t } = useLang();
  return (
    <li className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
      {teacher.photo ? (
        <img src={teacher.photo} alt={teacher.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-100" />
      ) : (
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700 ring-4 ring-brand-50" aria-hidden>
          {initials(teacher.name) || "👩‍🏫"}
        </span>
      )}
      <h3 className="mt-3 font-semibold text-brand-800">{teacher.name}</h3>
      <p className="text-sm text-slate-600">{teacher.designation}</p>
      <p className="mt-1 rounded-full bg-brand-50 px-3 py-0.5 text-sm font-medium text-brand-700">{teacher.subject}</p>
      {(teacher.qualification || teacher.experience) && (
        <p className="mt-2 text-xs text-slate-500">{[teacher.qualification, teacher.experience && `${t("Experience", "अनुभव")}: ${teacher.experience}`].filter(Boolean).join(" · ")}</p>
      )}
      {teacher.incharge && (
        <span className="mt-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-accent-400">⭐ {t("Website in-charge", "वेबसाइट प्रभारी")}</span>
      )}
      {children}
    </li>
  );
}

export function TeachersPage() {
  const school = useSchool();
  const { t } = useLang();
  const role = useStaffRole();
  const [teachers, save] = useTeachers(school.udise);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const current = teachers.find((x) => x.id === editing);
  const small = "rounded px-2 py-1 text-xs font-medium ring-1";

  return (
    <>
      <SchoolPageHeader title={t("Our Teachers", "हमारे शिक्षक")} subtitle={school.name} />
      <PageBody>
        <StaffOnly prompt>
          <div className="space-y-3">
            {editing === null ? (
              <button type="button" onClick={() => setEditing("new")} className="rounded-md bg-brand-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-800">
                ➕ {t("Add teacher", "शिक्षक जोड़ें")}
              </button>
            ) : (
              <TeacherForm
                key={editing}
                initial={current ?? EMPTY}
                onCancel={() => setEditing(null)}
                onSave={(v) => {
                  save(current ? teachers.map((x) => (x.id === current.id ? { ...x, ...v } : x)) : [...teachers, { ...v, id: newId() }]);
                  setEditing(null);
                }}
              />
            )}
            <p className="text-sm text-slate-600">
              {role === "principal"
                ? t("Tip: choose one teacher as ⭐ Website in-charge. That teacher can then log in and update everything on the website.", "सुझाव: एक शिक्षक को ⭐ वेबसाइट प्रभारी बनाएँ। वह शिक्षक लॉगिन करके वेबसाइट की सारी जानकारी बदल सकेगा।")
                : t("Only the Principal can change the Website in-charge.", "वेबसाइट प्रभारी सिर्फ़ प्रधानाध्यापक बदल सकते हैं।")}
            </p>
          </div>
        </StaffOnly>

        <Section title={t("Principal", "प्रधानाध्यापक")}>
          <div className="flex items-center gap-4">
            <PrincipalAvatar className="h-20 w-20 ring-4 ring-accent-400" />
            <div>
              <p className="text-lg font-semibold text-brand-800">{principalLabel(school)}</p>
              <p className="text-sm text-slate-600">{t("Principal / Headmaster", "प्रधानाध्यापक")}</p>
            </div>
          </div>
        </Section>

        <Section title={`${t("Teaching staff", "शिक्षक")} (${teachers.length})`}>
          {teachers.length === 0 ? (
            <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-slate-500">
              {t("Teacher details will be added here by the school.", "शिक्षकों की जानकारी स्कूल द्वारा यहाँ जोड़ी जाएगी।")}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teachers.map((x) => (
                <Card key={x.id} teacher={x}>
                  {role && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <button type="button" onClick={() => setEditing(x.id)} className={`${small} text-brand-700 ring-brand-600/40 hover:bg-brand-50`}>
                        ✏ {t("Edit", "बदलें")}
                      </button>
                      {role === "principal" && !x.incharge && (
                        <button
                          type="button"
                          onClick={() => save(teachers.map((y) => ({ ...y, incharge: y.id === x.id })))}
                          className={`${small} text-amber-800 ring-amber-300 hover:bg-amber-50`}
                        >
                          ⭐ {t("Make in-charge", "प्रभारी बनाएँ")}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => confirm(t("Remove this teacher?", "इस शिक्षक को हटाएँ?")) && save(teachers.filter((y) => y.id !== x.id))}
                        className={`${small} text-red-600 ring-red-200 hover:bg-red-50`}
                      >
                        {t("Remove", "हटाएँ")}
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </ul>
          )}
        </Section>
      </PageBody>
    </>
  );
}
