import { useLocalList } from "./localStore";

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  subject: string;
  qualification?: string;
  experience?: string;
  photo?: string; // small JPEG data URL
  incharge?: boolean; // website in-charge: can edit everything on the site
}

export function useTeachers(udise: string) {
  return useLocalList<Teacher>(`teachers-${udise}`);
}
