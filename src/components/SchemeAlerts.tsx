import { useState, type FormEvent } from "react";
import { newId } from "../data/localStore";
import { useSentLog, useSubscribers, type AlertSubscriber } from "../data/schemeAlerts";
import { CATEGORIES, eligible, SCHEMES, type Category, type WelfareScheme } from "../data/schemes";
import { displayPhone } from "../data/schools";
import { useLang } from "../i18n";
import { useSchool } from "../schoolContext";

const input = "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none";

const now = () => Date.now();
const forStudent = (s: AlertSubscriber) => SCHEMES.filter((x) => eligible(x, s.cls, s.girl, s.cat));

// Parents register their child once; the school then alerts them about every scheme the child can get.
export function SchemeAlertSignup() {
  const school = useSchool();
  const { t } = useLang();
  const [subs, save] = useSubscribers(school.udise);
  const classes = Array.from({ length: school.classTo - school.classFrom + 1 }, (_, i) => school.classFrom + i);
  const [student, setStudent] = useState("");
  const [cls, setCls] = useState(classes[0]);
  const [girl, setGirl] = useState(false);
  const [cat, setCat] = useState<Category>("General");
  const [parent, setParent] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState<AlertSubscriber | null>(null);
  const validPhone = /^[6-9]\d{9}$/.test(phone);

  function submit(e: FormEvent) {
    e.preventDefault();
    const sub: AlertSubscriber = { id: newId(), student: student.trim(), cls, girl, cat, parent: parent.trim(), phone, createdAt: now() };
    save([...subs.filter((x) => !(x.phone === phone && x.student.toLowerCase() === sub.student.toLowerCase())), sub]);
    setDone(sub);
  }

  if (done) {
    const list = forStudent(done);
    return (
      <div className="rounded-lg bg-green-50 p-4 text-green-900 ring-1 ring-green-200">
        <p className="font-semibold">✓ {t("Registered! The school will send scheme alerts to", "रजिस्टर हो गया! स्कूल योजना की सूचना भेजेगा")} {displayPhone(done.phone)}.</p>
        <p className="mt-2 text-sm">{t(`${done.student} may be eligible for ${list.length} schemes right now:`, `${done.student} अभी ${list.length} योजनाओं के लिए पात्र हो सकते हैं:`)}</p>
        <ul className="mt-1 list-disc pl-5 text-sm">
          {list.map((s) => (
            <li key={s.id}>
              {s.icon} {t(s.name.en, s.name.hi)}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => { setDone(null); setStudent(""); setAgree(false); }} className="mt-3 text-sm underline">
          {t("Register another child", "दूसरे बच्चे को रजिस्टर करें")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-slate-700">
        {t(
          "Register your child once. When a scheme or scholarship opens that your child can get, the school will send you a message on WhatsApp or SMS.",
          "अपने बच्चे को एक बार रजिस्टर करें। जब भी कोई योजना या छात्रवृत्ति खुलेगी जिसके लिए आपका बच्चा पात्र है, स्कूल आपको WhatsApp या SMS पर सूचना भेजेगा।",
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Student's name", "छात्र/छात्रा का नाम")} *</span>
          <input required maxLength={60} value={student} onChange={(e) => setStudent(e.target.value)} className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Class", "कक्षा")} *</span>
          <select value={cls} onChange={(e) => setCls(Number(e.target.value))} className={input}>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Category", "वर्ग")} *</span>
          <select value={cat} onChange={(e) => setCat(e.target.value as Category)} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {t(c.en, c.hi)}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-slate-700">{t("Student", "छात्र")} *</legend>
          <div className="flex gap-2">
            {([[false, t("Boy", "लड़का")], [true, t("Girl", "लड़की")]] as const).map(([v, label]) => (
              <button key={String(v)} type="button" aria-pressed={girl === v} onClick={() => setGirl(v)} className={`flex-1 rounded-md px-3 py-2.5 font-medium ring-1 ${girl === v ? "bg-brand-700 text-white ring-brand-700" : "bg-white text-slate-700 ring-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Parent's name", "अभिभावक का नाम")} *</span>
          <input required maxLength={60} value={parent} onChange={(e) => setParent(e.target.value)} className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">{t("Parent's mobile (WhatsApp)", "अभिभावक का मोबाइल (WhatsApp)")} *</span>
          <input required inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="98XXXXXXXX" className={input} />
          {phone.length === 10 && !validPhone && <span className="text-xs text-red-600">{t("Enter a valid 10-digit mobile number.", "सही 10 अंकों का मोबाइल नंबर लिखें।")}</span>}
        </label>
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-700" />
        <span>{t("I agree that the school may send scheme and scholarship messages to this number. The number is used only by the school.", "मैं सहमत हूँ कि स्कूल इस नंबर पर योजना और छात्रवृत्ति की सूचना भेज सकता है। नंबर का उपयोग सिर्फ़ स्कूल करेगा।")}</span>
      </label>
      <button type="submit" disabled={!agree || !validPhone} className="rounded-md bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800 disabled:opacity-50">
        🔔 {t("Get scheme alerts", "योजना अलर्ट पाएँ")}
      </button>
    </form>
  );
}

function alertText(s: WelfareScheme, sub: AlertSubscriber, schoolName: string, phone: string): string {
  return [
    `नमस्ते ${sub.parent} जी,`,
    `${schoolName} की ओर से सूचना: ${sub.student} (कक्षा ${sub.cls}) "${s.name.hi}" के लिए पात्र हो सकते हैं।`,
    `लाभ: ${s.benefit.hi}`,
    `कैसे मिलेगा: ${s.how.hi}`,
    s.link ? `वेबसाइट: ${s.link}` : "",
    `ज़्यादा जानकारी के लिए स्कूल से संपर्क करें: ${phone}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Staff: pick a scheme, see which registered students are eligible and message their parents.
export function SchemeAlertsPanel() {
  const school = useSchool();
  const { t } = useLang();
  const [subs, saveSubs] = useSubscribers(school.udise);
  const [sent, saveSent] = useSentLog(school.udise);
  const [schemeId, setSchemeId] = useState(SCHEMES.find((s) => s.kind === "scholarship")?.id ?? SCHEMES[0].id);
  const scheme = SCHEMES.find((s) => s.id === schemeId)!;
  const targets = subs.filter((s) => eligible(scheme, s.cls, s.girl, s.cat));
  const phone = displayPhone(school.hmPhone);
  const wasSent = (sub: AlertSubscriber) => sent.find((x) => x.schemeId === scheme.id && x.subscriberId === sub.id);
  const mark = (sub: AlertSubscriber) => !wasSent(sub) && saveSent([...sent, { schemeId: scheme.id, subscriberId: sub.id, at: now() }]);
  const btn = "rounded-md px-3 py-1.5 text-sm font-semibold";

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {t(`${subs.length} parents registered for alerts.`, `${subs.length} अभिभावकों ने अलर्ट के लिए रजिस्टर किया है।`)}
      </p>
      <label className="block max-w-md">
        <span className="mb-1 block text-sm font-medium text-slate-700">{t("Scheme to announce", "किस योजना की सूचना भेजनी है")}</span>
        <select value={schemeId} onChange={(e) => setSchemeId(e.target.value)} className={input}>
          {SCHEMES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {t(s.name.en, s.name.hi)}
            </option>
          ))}
        </select>
      </label>
      <p className="rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
        {t(`${targets.length} eligible students · ${targets.filter(wasSent).length} already informed`, `${targets.length} पात्र छात्र · ${targets.filter(wasSent).length} को सूचना भेजी जा चुकी है`)}
      </p>
      {targets.length === 0 ? (
        <p className="text-sm text-slate-500">{t("No registered student is eligible for this scheme.", "इस योजना के लिए कोई रजिस्टर्ड छात्र पात्र नहीं है।")}</p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 rounded-lg ring-1 ring-slate-200">
            {targets.map((sub) => {
              const text = encodeURIComponent(alertText(scheme, sub, school.name, phone));
              const done = wasSent(sub);
              return (
                <li key={sub.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {sub.student} <span className="text-sm font-normal text-slate-500">· {t("Class", "कक्षा")} {sub.cls} · {sub.girl ? t("Girl", "छात्रा") : t("Boy", "छात्र")} · {sub.cat}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      {sub.parent} · {displayPhone(sub.phone)}
                    </p>
                  </div>
                  {done && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">✓ {t("Sent", "भेजा गया")}</span>}
                  <a href={`https://wa.me/91${sub.phone}?text=${text}`} target="_blank" rel="noreferrer" onClick={() => mark(sub)} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
                    WhatsApp
                  </a>
                  <a href={`sms:+91${sub.phone}?body=${text}`} onClick={() => mark(sub)} className={`${btn} text-brand-700 ring-1 ring-brand-600`}>
                    SMS
                  </a>
                  <button type="button" onClick={() => confirm(t("Remove this registration?", "यह रजिस्ट्रेशन हटाएँ?")) && saveSubs(subs.filter((x) => x.id !== sub.id))} className="text-xs text-red-600 hover:underline">
                    {t("Remove", "हटाएँ")}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(targets.map((s) => `+91${s.phone}`).join(", "))}
            className={`${btn} text-slate-700 ring-1 ring-slate-300`}
          >
            📋 {t("Copy all numbers (for a WhatsApp broadcast list)", "सभी नंबर कॉपी करें (WhatsApp ब्रॉडकास्ट लिस्ट के लिए)")}
          </button>
        </>
      )}
    </div>
  );
}
