import { Link } from "react-router-dom";
import { SchemeAlertsPanel } from "../components/SchemeAlerts";
import { SchoolPageHeader } from "../components/SchoolPageHeader";
import { PageBody, Section } from "../components/ui";
import { useSubscribers } from "../data/schemeAlerts";
import { useTeachers } from "../data/teachers";
import { usePendingCount } from "../data/faq";
import { useLang } from "../i18n";
import { useSchool, useSchoolPath } from "../schoolContext";
import { openStaffLogin, useStaffRole } from "../staff/staff";
import { useRoleLabel } from "../staff/roleLabel";

// One place for the Principal or the website in-charge teacher to update the site.
export function StaffPage() {
  const school = useSchool();
  const to = useSchoolPath();
  const { t } = useLang();
  const role = useStaffRole();
  const label = useRoleLabel(role);
  const [teachers] = useTeachers(school.udise);
  const [subs] = useSubscribers(school.udise);
  const pending = usePendingCount(school.udise);

  if (!role) {
    return (
      <>
        <SchoolPageHeader title={t("Staff panel", "स्टाफ़ पैनल")} subtitle={school.name} />
        <PageBody>
          <button type="button" onClick={openStaffLogin} className="rounded-md bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
            🔐 {t("Log in to continue", "आगे बढ़ने के लिए लॉगिन करें")}
          </button>
        </PageBody>
      </>
    );
  }

  const cards = [
    { icon: "👩‍🏫", path: "teachers", en: "Teachers", hi: "शिक्षक", count: teachers.length, note: t("Add, edit, choose in-charge", "जोड़ें, बदलें, प्रभारी चुनें") },
    { icon: "❓", path: "principal#faq", en: "Questions to answer", hi: "जवाब देने वाले सवाल", count: pending, note: t("Answer visitors' questions", "आगंतुकों के सवालों के जवाब दें"), alert: pending > 0 },
    { icon: "📢", path: "notices", en: "Notices", hi: "सूचनाएँ", note: t("Also scroll on the home page", "होम पेज पर भी चलती हैं") },
    { icon: "🏆", path: "results", en: "Results", hi: "रिज़ल्ट", note: t("Upload result PDFs", "रिज़ल्ट PDF अपलोड करें") },
    { icon: "🖼", path: "gallery", en: "Photos", hi: "फ़ोटो", note: t("Also shown in the home slideshow", "होम पेज स्लाइडशो में भी दिखेंगी") },
    { icon: "📥", path: "downloads", en: "Downloads", hi: "डाउनलोड", note: t("Forms and documents", "फ़ॉर्म और दस्तावेज़") },
  ];

  return (
    <>
      <SchoolPageHeader title={t("Staff panel", "स्टाफ़ पैनल")} subtitle={`${t("Logged in as", "लॉगिन")}: ${label}`} />
      <PageBody>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.path}>
              <Link to={to(c.path)} className={`flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 transition hover:shadow-md ${c.alert ? "ring-amber-400" : "ring-slate-200"}`}>
                <span className="text-3xl" aria-hidden>
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-brand-800">
                    {t(c.en, c.hi)}
                    {c.count !== undefined && <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${c.alert ? "bg-amber-500 text-white" : "bg-brand-50 text-brand-700"}`}>{c.count}</span>}
                  </span>
                  <span className="block text-sm text-slate-600">{c.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Section title={`🔔 ${t("Send scheme alerts to parents", "अभिभावकों को योजना अलर्ट भेजें")} (${subs.length})`}>
          <SchemeAlertsPanel />
        </Section>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
          {t("Demo: changes are saved only in this browser. On the final website they are saved online and everyone sees them.", "डेमो: बदलाव अभी सिर्फ़ इसी ब्राउज़र में सेव होते हैं। फ़ाइनल वेबसाइट में ये ऑनलाइन सेव होंगे और सबको दिखेंगे।")}
        </p>
      </PageBody>
    </>
  );
}
