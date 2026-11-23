import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { defaultFaqs, useQuestions, type Question } from "../data/faq";
import { newId } from "../data/localStore";
import { displayPhone } from "../data/schools";
import { formatDate } from "../data/uploads";
import { useLang } from "../i18n";
import { useSchool, useSchoolPath } from "../schoolContext";
import { useStaffRole } from "../staff/staff";

const input = "w-full rounded-md border border-slate-300 px-3 py-2.5 text-base focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none";
const day = (ms: number) => {
  const d = new Date(ms);
  return formatDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
};

function QA({ q, a, meta }: { q: string; a: string; meta?: string }) {
  return (
    <details className="group rounded-lg bg-white ring-1 ring-slate-200 open:ring-brand-600/40">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 font-medium text-slate-900">
        <span className="text-brand-600" aria-hidden>
          Q.
        </span>
        <span className="flex-1">{q}</span>
        <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="border-t border-slate-100 px-4 py-3 text-slate-700">
        <p className="whitespace-pre-line">
          <strong className="text-brand-700">{"A. "}</strong>
          {a}
        </p>
        {meta && <p className="mt-2 text-xs text-slate-500">{meta}</p>}
      </div>
    </details>
  );
}

function AskForm({ onAsked }: { onAsked: () => void }) {
  const school = useSchool();
  const { t } = useLang();
  const [questions, save] = useQuestions(school.udise);
  const [name, setName] = useState("");
  const [who, setWho] = useState<Question["who"]>("parent");
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    save([...questions, { id: newId(), name: name.trim(), who, question: text.trim(), askedAt: Date.now() }]);
    setText("");
    onAsked();
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg bg-brand-50 p-4 ring-1 ring-brand-100">
      <p className="font-semibold text-brand-800">✍ {t("Ask the Principal a question", "प्रधानाध्यापक से सवाल पूछें")}</p>
      <textarea
        required
        rows={3}
        maxLength={500}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("Write your question about admission, studies, facilities…", "एडमिशन, पढ़ाई, सुविधाओं आदि के बारे में अपना सवाल लिखें…")}
        className={input}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t("Your name (optional)", "आपका नाम (वैकल्पिक)")} className={input} />
        <select value={who} onChange={(e) => setWho(e.target.value as Question["who"])} className={input}>
          <option value="parent">{t("Parent", "अभिभावक")}</option>
          <option value="student">{t("Student", "छात्र")}</option>
          <option value="other">{t("Other", "अन्य")}</option>
        </select>
      </div>
      <p className="text-xs text-slate-500">{t("Please don't write phone numbers or Aadhaar here. Answers are shown publicly on this page.", "यहाँ फ़ोन नंबर या आधार न लिखें। जवाब इसी पेज पर सबको दिखेंगे।")}</p>
      <button type="submit" className="rounded-md bg-brand-700 px-5 py-2.5 font-semibold text-white hover:bg-brand-800">
        {t("Send question", "सवाल भेजें")}
      </button>
    </form>
  );
}

// Staff view: unanswered questions with a box to write and publish the answer.
function PendingQuestions() {
  const school = useSchool();
  const { t } = useLang();
  const [questions, save] = useQuestions(school.udise);
  const pending = questions.filter((q) => !q.answer);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  if (!pending.length) return <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">✓ {t("No new questions to answer.", "जवाब देने के लिए कोई नया सवाल नहीं।")}</p>;
  return (
    <ul className="space-y-3">
      {pending.map((q) => (
        <li key={q.id} className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="text-xs text-amber-800">
            {q.name || t("Visitor", "आगंतुक")} · {t(q.who === "parent" ? "Parent" : q.who === "student" ? "Student" : "Other", q.who === "parent" ? "अभिभावक" : q.who === "student" ? "छात्र" : "अन्य")} · {day(q.askedAt)}
          </p>
          <p className="mt-1 font-medium text-slate-900">{q.question}</p>
          <textarea
            rows={2}
            value={drafts[q.id] ?? ""}
            onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
            placeholder={t("Write the answer…", "जवाब लिखें…")}
            className={`${input} mt-2 bg-white`}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={!drafts[q.id]?.trim()}
              onClick={() => save(questions.map((x) => (x.id === q.id ? { ...x, answer: drafts[q.id].trim(), answeredAt: Date.now() } : x)))}
              className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              ✓ {t("Publish answer", "जवाब प्रकाशित करें")}
            </button>
            <button type="button" onClick={() => confirm(t("Delete this question?", "यह सवाल हटाएँ?")) && save(questions.filter((x) => x.id !== q.id))} className="rounded-md px-3 py-2 text-sm text-red-600 ring-1 ring-red-200">
              {t("Delete", "हटाएँ")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Questions & answers under the Principal's Desk. `compact` shows a short list with a link to the full page.
export function AskPrincipal({ compact }: { compact?: boolean }) {
  const school = useSchool();
  const to = useSchoolPath();
  const { t } = useLang();
  const role = useStaffRole();
  const [questions, save] = useQuestions(school.udise);
  const [asked, setAsked] = useState(false);
  const answered = questions.filter((q) => q.answer).sort((a, b) => (b.answeredAt ?? 0) - (a.answeredAt ?? 0));
  const faqs = defaultFaqs(displayPhone(school.hmPhone));
  const items = [
    ...answered.map((q) => ({ key: q.id, q: q.question, a: q.answer!, meta: `${q.name || t("Visitor", "आगंतुक")} · ${t("answered", "जवाब")} ${day(q.answeredAt!)}`, id: q.id })),
    ...faqs.map((f) => ({ key: f.q.en, q: t(f.q.en, f.q.hi), a: t(f.a.en, f.a.hi), meta: undefined, id: undefined })),
  ];
  const shown = compact ? items.slice(0, 3) : items;

  return (
    <div className="space-y-4">
      {role && !compact && (
        <div className="space-y-2">
          <p className="font-semibold text-amber-800">🔔 {t("New questions from visitors", "आगंतुकों के नए सवाल")}</p>
          <PendingQuestions />
        </div>
      )}
      <div className="space-y-2">
        {shown.map((x) => (
          <div key={x.key} className="relative">
            <QA q={x.q} a={x.a} meta={x.meta} />
            {role && !compact && x.id && (
              <button
                type="button"
                onClick={() => confirm(t("Remove this question and answer?", "यह सवाल-जवाब हटाएँ?")) && save(questions.filter((y) => y.id !== x.id))}
                className="absolute top-3 right-9 text-xs text-red-600 hover:underline"
              >
                {t("Remove", "हटाएँ")}
              </button>
            )}
          </div>
        ))}
      </div>
      {compact ? (
        <Link to={`${to("principal")}#faq`} className="inline-block rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
          ✍ {t("Ask a question / see all", "सवाल पूछें / सभी देखें")} ({items.length})
        </Link>
      ) : asked ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 ring-1 ring-green-200">
          <p className="font-semibold">✓ {t("Thank you! Your question has been sent to the school.", "धन्यवाद! आपका सवाल स्कूल को भेज दिया गया है।")}</p>
          <p className="mt-1 text-sm">{t("The answer will appear in the list above.", "जवाब ऊपर की सूची में दिखेगा।")}</p>
          <button type="button" onClick={() => setAsked(false)} className="mt-2 text-sm underline">
            {t("Ask another question", "दूसरा सवाल पूछें")}
          </button>
        </div>
      ) : (
        <AskForm onAsked={() => setAsked(true)} />
      )}
    </div>
  );
}
