import type { Bi } from "../i18n";
import { useLocalList } from "./localStore";

export interface Question {
  id: string;
  name: string;
  who: "parent" | "student" | "other";
  question: string;
  answer?: string;
  askedAt: number;
  answeredAt?: number;
}

export function useQuestions(udise: string) {
  return useLocalList<Question>(`questions-${udise}`);
}

// Common questions answered from general rules; the school can add its own answers to visitors' questions.
export function defaultFaqs(phone: string): { q: Bi; a: Bi }[] {
  return [
    {
      q: { en: "When do admissions start?", hi: "एडमिशन कब शुरू होते हैं?" },
      a: {
        en: "Admissions usually begin before the new session starts in April, as per the department's guidelines. The date is posted on the Notices page.",
        hi: "विभाग के दिशा-निर्देश के अनुसार एडमिशन आम तौर पर अप्रैल में नया सत्र शुरू होने से पहले होते हैं। तारीख सूचना पेज पर दी जाती है।",
      },
    },
    {
      q: { en: "Which documents are needed for admission?", hi: "एडमिशन के लिए कौन-से कागज़ात चाहिए?" },
      a: {
        en: "Usually birth certificate, Aadhaar, previous school's TC and report card, and passport-size photos. See the Admissions page for the full list.",
        hi: "आम तौर पर जन्म प्रमाण पत्र, आधार, पिछले स्कूल का TC और रिपोर्ट कार्ड, और पासपोर्ट साइज़ फ़ोटो। पूरी सूची एडमिशन पेज पर है।",
      },
    },
    {
      q: { en: "Is there any fee?", hi: "क्या कोई फ़ीस है?" },
      a: {
        en: "Education is free in government schools, and Classes 1 to 8 are free under the RTE Act. For any charges in Classes 9 to 12, please ask the school office.",
        hi: "सरकारी स्कूलों में पढ़ाई मुफ़्त है, और RTE कानून के तहत कक्षा 1 से 8 पूरी तरह मुफ़्त है। कक्षा 9 से 12 के किसी शुल्क के लिए स्कूल कार्यालय से पूछें।",
      },
    },
    {
      q: { en: "How can I meet the Principal?", hi: "प्रधानाध्यापक से कैसे मिलें?" },
      a: {
        en: `Parents can meet the Principal on school working days. Please call ${phone} to fix a time.`,
        hi: `अभिभावक स्कूल के कार्य-दिवसों में प्रधानाध्यापक से मिल सकते हैं। समय तय करने के लिए ${phone} पर फ़ोन करें।`,
      },
    },
  ];
}

export function usePendingCount(udise: string): number {
  const [questions] = useQuestions(udise);
  return questions.filter((q) => !q.answer).length;
}
