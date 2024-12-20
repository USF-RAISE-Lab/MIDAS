//import { FetchSchoolData } from "@/app/api/data/downloadSchoolData";
//import { FetchRiskData } from "@/app/api/data/risk-data/get-risk-data";
import useMidasStore, { SchoolData } from "@/hooks/useSchoolData";


export async function loadData(schoolId: number) {
  try {
    const resSchoolData = await fetch(`/api/data/school-data`);
    const jsonSchoolData = await resSchoolData.json();
    const schoolData = jsonSchoolData.data;
    //
    //const schoolData = await FetchSchoolData(schoolId);
    //const riskData = await FetchRiskData(schoolId);
    //
    const resRiskData = await fetch('/api/data/risk-data')
    const jsonRiskData = await resRiskData.json();
    const riskData = jsonRiskData.data;

    if (!schoolData || !riskData) {
      throw new Error("Failed to load data");
    }

    const combinedData: SchoolData[] = schoolData.map((student: SchoolData) => {
      const studentRisks = riskData.filter((risk: any) => risk.studentid === student.studentid);
      const riskObj = {
        student: { risklevel: "", confidence: "" },
        teacher: { risklevel: "", confidence: "" },
        midas: { risklevel: "", confidence: "" }
      };

      studentRisks.forEach((risk: any) => {
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
