/**
 * Hook for global schoolData state. Contains student data where user.schoolId == student.school_id.
 */


import { create } from 'zustand';

interface RiskData {
  risklevel: string;
  confidence: string;
}

export interface SchoolData {
  studentid: string;
  schoollevel: string;
  gradelevel: number;
  classroom: string;
  gender: string;
  ethnicity: string;
  ell: string;
  odr_f: string;
  susp_f: string;
  math_f: string;
  read_f: string;
  mysaebrs_emo: string;
  mysaebrs_soc: string;
  mysaebrs_aca: string;
  saebrs_emo: string;
  saebrs_soc: string;
  saebrs_aca: string;
  school_id: number;
  risk: {
    student?: RiskData;
    teacher?: RiskData;
    midas?: RiskData;
  };
}

interface MidasState {
  students: Record<string, SchoolData>;
  loadStudents: (students: SchoolData[]) => void;
  getStudentById: (schoolId: number, studentId: string) => SchoolData[];
  getStudentsBySchoolId: (schoolId: number) => SchoolData[];
  getStudentsByGradeLevel: (schoolId: number, gradelevel: number) => SchoolData[];
  getStudentsByClassroom: (schoolId: number, classroom: string) => SchoolData[];
}

const useMidasStore = create<MidasState>((set, get) => ({
  students: {},

  loadStudents: (students: SchoolData[]) => {
    const studentMap = students.reduce((acc, student) => {
      acc[student.studentid] = student;
      return acc;
    }, {} as Record<string, SchoolData>);

    set({ students: studentMap });
  },

  getStudentById: (schoolId: number, studentId: string) => {
    return Object.values(get().students).filter(student => student.studentid === studentId && student.school_id === schoolId);
  },

  getStudentsBySchoolId: (schoolId: number) => {
    return Object.values(get().students).filter(student => student.school_id === schoolId);
  },

  getStudentsByGradeLevel: (schoolId: number, gradelevel: number) => {
    return Object.values(get().students).filter(
      student => student.school_id === schoolId && student.gradelevel === gradelevel
    );
  },

  getStudentsByClassroom: (schoolId: number, classroom: string) => {
    return Object.values(get().students).filter(
      student => student.school_id === schoolId && student.classroom === classroom
    );
  },
}));

export default useMidasStore;
