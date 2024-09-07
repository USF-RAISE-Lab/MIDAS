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
  getStudentById: (studentid: string) => SchoolData | null;
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

  getStudentById: (studentid: string) => {
    return get().students[studentid] || null;
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

//
//
// import { create } from 'zustand';
//
// interface RiskData {
//   student?: {
//     risklevel: string;
//     confidence: string;
//   };
//   teacher?: {
//     risklevel: string;
//     confidence: string;
//   };
//   midas?: {
//     risklevel: string;
//     confidence: string;
//   };
// }
//
// export interface SchoolData {
//   studentid: string;
//   schoollevel: string;
//   gradelevel: number;
//   classroom: string;
//   gender: string;
//   ethnicity: string;
//   ell: string;
//   odr_f: string;
//   susp_f: string;
//   math_f: string;
//   read_f: string;
//   mysaebrs_emo: string;
//   mysaebrs_soc: string;
//   mysaebrs_aca: string;
//   saebrs_emo: string;
//   saebrs_soc: string;
//   saebrs_aca: string;
//   school_id: number;
//   risk?: RiskData;
// }
//
// interface RiskFactor {
//   risklevel: string | null;
//   confidence: string | null;
// }
//
// function calculateRiskStatistics(students: SchoolData[]): RiskStatistics {
//   let lowRisk = 0;
//   let someRisk = 0;
//   let highRisk = 0;
//   const totalStudents = students.length;
//
//   students.forEach(student => {
//     const riskFactors = student.risk;
//     if (riskFactors) {
//       ['student', 'teacher', 'midas'].forEach(factor => {
//         const riskLevel = (riskFactors as any)[factor]?.risklevel;
//         if (riskLevel === 'low') lowRisk++;
//         if (riskLevel === 'some') someRisk++;
//         if (riskLevel === 'high') highRisk++;
//       });
//     }
//   });
//
//   return {
//     lowRisk: (lowRisk / (totalStudents * 3)) * 100, // 3 because each student has 3 risk factors
//     someRisk: (someRisk / (totalStudents * 3)) * 100,
//     highRisk: (highRisk / (totalStudents * 3)) * 100,
//     totalStudents,
//   };
// }
//
// // Extending the existing types with necessary data
// interface MidasState {
//   students: Record<string, SchoolData>;
//   loadStudents: (students: SchoolData[]) => void;
//   getStudentById: (studentid: string) => SchoolData | null;
//   getAllStudents: () => SchoolData[];
//   getRiskStatisticsBySchool: (schoolId: number) => RiskStatistics;
//   getRiskStatisticsByGrade: (schoolId: number, grade: number) => RiskStatistics;
//   getRiskStatisticsByClassroom: (schoolId: number, classroom: string) => RiskStatistics;
// }
//
// interface RiskStatistics {
//   lowRisk: number;
//   someRisk: number;
//   highRisk: number;
//   totalStudents: number;
// }
//
// const useMidasStore = create<MidasState>((set, get) => ({
//   students: {},
//   studentsLoaded: false,
//   loadStudents: (students) => set((state) => {
//     const aggregatedData = students.reduce<Record<string, SchoolData>>((acc, student) => {
//       acc[student.studentid] = student;
//       return acc;
//     }, {});
//
//     return { students: aggregatedData };
//   }),
//   getStudentById: (studentid) => {
//     const state = get();
//     return state.students[studentid] || null;
//   },
//   getAllStudents: () => {
//     const state = get();
//     return Object.values(state.students);
//   },
//   getRiskStatisticsBySchool: (schoolId) => {
//     const students = get().getAllStudents().filter(student => student.school_id === schoolId);
//     return calculateRiskStatistics(students);
//   },
//   getRiskStatisticsByGrade: (schoolId, grade) => {
//     const students = get().getAllStudents().filter(student => student.school_id === schoolId && student.gradelevel === grade);
//     return calculateRiskStatistics(students);
//   },
//   getRiskStatisticsByClassroom: (schoolId, classroom) => {
//     const students = get().getAllStudents().filter(student => student.school_id === schoolId && student.classroom === classroom);
//     return calculateRiskStatistics(students);
//   },
// }));
//
// export default useMidasStore;
//
//
//
//
//
// /**
//  * schoolId, studentId, riskId, midasRisk, midasConfidence, teacherRisk, teacherConfidence, studentRisk, studentConfidence, odr, susp, readRisk, mathRisk, ethnicity, ell, gender
//  */
//
// // type Student = {
// //   schoolId: number,
// //   studentId: string,
// //   classroom: string,
// //   ell: string,
// //   ethnicity: string,
// //   gender: string,
// //   gradeLevel: number,
// //   mathRisk: string,
// //   readRisk: string,
// //   odr: string,
// //   susp: string,
// // }
// //
// //
// // interface SchoolDataStore {
// //   studentArray: Student[];
// //
// //   midasRisk: string;
// //   midasConf: string;
// //
// //   teacherRisk: string;
// //   teacherConf: string;
// //
// //   studentRisk: string;
// //   studentConf: string;
// //
// //   odr: string;
// //   susp: string;
// //
// //   readRisk: string;
// //   mathRisk: string;
// //
// //   ethnicity: string;
// //   ell: string;
// //   gender: string;
// // }
// //
// // const useSchoolData = create<SchoolDataStore>((set: any) => ({
// //   studentData: undefined
// //  }))
//
// // export default useSchoolData;
