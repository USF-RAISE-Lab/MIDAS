import { FetchRiskData, FetchSchoolData } from "@/app/api/data/downloadSchoolData";
import useMidasStore from "@/hooks/useSchoolData";


export async function loadData(schoolId: number) {
  try {
    const schoolData = await FetchSchoolData(schoolId);
    const riskData = await FetchRiskData(schoolId);

    if (!schoolData || !riskData) {
      throw new Error("Failed to load data");
    }

    const combinedData = schoolData.map(student => {
      const studentRisks = riskData.filter(risk => risk.studentid === student.studentid);
      console.log("STUDENT RISKS");
      console.log(studentRisks);
      const riskObj = {
        student: {},
        teacher: {},
        midas: {}
      };

      studentRisks.forEach(risk => {
        console.log(`RISK N: ${risk.factor}`)
        if (risk.factor.toLowerCase() === 'student') {
          riskObj.student = {
            risklevel: risk.risklevel,
            confidence: risk.confidence,
          };
        } else if (risk.factor.toLowerCase() === 'teacher') {
          riskObj.teacher = {
            risklevel: risk.risklevel,
            confidence: risk.confidence,
          };
        } else if (risk.factor.toLowerCase() === 'midas') {
          riskObj.midas = {
            risklevel: risk.risklevel,
            confidence: risk.confidence,
          };
        }
      });

      return {
        ...student,
        risk: riskObj
      };
    });

    useMidasStore.getState().loadStudents(combinedData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}
