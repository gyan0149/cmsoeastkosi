import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { useRoleLabel } from "./roleLabel";
import { useSchool, useSchoolPath } from "../schoolContext";
import { DEMO_PINS, OPEN_LOGIN, openStaffLogin, setStaffRole, useStaffRole } from "./staff";

// Top-bar button: "Staff login", or who is logged in with a logout link.
export function StaffButton() {
  const role = useStaffRole();
  const school = useSchool();
  const to = useSchoolPath();
  const { t } = useLang();
  const label = useRoleLabel(role);
  if (!role) {
    return (
      <button type="button" onClick={openStaffLogin} className="rounded-full bg-white/10 px-2.5 py-1 text-white hover:bg-white/20">
        🔐 {t("Staff login", "स्टाफ़ लॉगिन")}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <Link to={to("staff")} className="rounded-full bg-accent-500 px-2.5 py-1 font-semibold text-brand-900" title={label}>
        ✏ {t("Staff panel", "स्टाफ़ पैनल")}
      </Link>
      <button type="button" onClick={() => setStaffRole(school.udise, null)} className="text-white underline">
        {t("Logout", "लॉगआउट")}
      </button>
    </span>
  );
}

// PIN dialog; mounted once in the layout and opened from anywhere with openStaffLogin().
export function StaffLoginDialog() {
  const school = useSchool();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const show = () => {
      setPin("");
      setError(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_LOGIN, show);
    return () => window.removeEventListener(OPEN_LOGIN, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const role = DEMO_PINS[pin.trim()];
    if (!role) {
      setError(true);
      return;
    }
    setStaffRole(school.udise, role);
    setOpen(false);
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="staff-login-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <h2 id="staff-login-title" className="text-lg font-bold text-brand-800">
          🔐 {t("School staff login", "स्कूल स्टाफ़ लॉगिन")}
        </h2>
        <p className="text-sm text-slate-600">
          {t(
            "The Principal and the teacher in charge of the website can add and edit teachers, notices, results, photos, answers to questions and scheme alerts.",
            "प्रधानाध्यापक और वेबसाइट प्रभारी शिक्षक, शिक्षकों की जानकारी, सूचनाएँ, रिज़ल्ट, फ़ोटो, सवालों के जवाब और योजना अलर्ट जोड़ और बदल सकते हैं।",
          )}
        </p>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">PIN</span>
          <input
            autoFocus
            inputMode="numeric"
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-lg tracking-widest focus:border-brand-600 focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-600">{t("Wrong PIN. Please try again.", "गलत PIN। फिर से कोशिश करें।")}</p>}
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200">
          {t("Demo PINs: Principal 1111 · Website in-charge teacher 2222. The final website will use a secure login for each person.", "डेमो PIN: प्रधानाध्यापक 1111 · वेबसाइट प्रभारी शिक्षक 2222। फ़ाइनल वेबसाइट में हर व्यक्ति का सुरक्षित लॉगिन होगा।")}
        </p>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 rounded-md bg-brand-700 px-4 py-2.5 font-semibold text-white hover:bg-brand-800">
            {t("Log in", "लॉगिन")}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="rounded-md px-4 py-2.5 font-semibold text-slate-600 ring-1 ring-slate-300">
            {t("Cancel", "रद्द")}
          </button>
        </div>
      </form>
    </div>
  );
}

// Shows children only to logged-in staff; others see an optional small login prompt.
export function StaffOnly({ children, prompt }: { children: ReactNode; prompt?: boolean }) {
  const role = useStaffRole();
  const { t } = useLang();
  if (role) return <>{children}</>;
  if (!prompt) return null;
  return (
    <button type="button" onClick={openStaffLogin} className="text-sm font-medium text-slate-500 hover:text-brand-700 hover:underline">
      🔐 {t("School staff? Log in to add or edit", "स्कूल स्टाफ़? जोड़ने या बदलने के लिए लॉगिन करें")}
    </button>
  );
}
