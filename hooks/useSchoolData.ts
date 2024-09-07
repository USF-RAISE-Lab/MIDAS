/**
 * Hook for global schoolData state. Contains student data where user.schoolId == student.school_id.
 */

import { create } from 'zustand';

/**
 * schoolId, studentId, riskId, midasRisk, midasConfidence, teacherRisk, teacherConfidence, studentRisk, studentConfidence, odr, susp, readRisk, mathRisk, ethnicity, ell, gender
 */

type Student = {
  schoolId: number,
  studentId: string,
  classroom: string,
  ell: string,
  ethnicity: string,
  gender: string,
  gradeLevel: number,
  mathRisk: string,
  readRisk: string,
  odr: string,
  susp: string,
}


interface SchoolDataStore {
  studentArray: Student[];

  midasRisk: string;
  midasConf: string;

  teacherRisk: string;
  teacherConf: string;

  studentRisk: string;
  studentConf: string;

  odr: string;
  susp: string;

  readRisk: string;
  mathRisk: string;

  ethnicity: string;
  ell: string;
  gender: string;
}

const useSchoolData = create<SchoolDataStore>((set: any) => ({

}))

export default useSchoolData;
