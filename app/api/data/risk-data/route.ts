/**
 * API endpoint for getting data from the risk table.
 * @author Gabriel Hooks
 * @since 2024-10-05
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

/**
 * Fetch risk data from public.schooldata_join_risk
 * Columns: id(riskId), factor(student, teacher, midas), risklevel, confidence, schoolId, studentId
 */
export async function FetchRiskData(schoolId: number) {
  const { data, error } = await supabase
    .from('schooldata_join_risk')
    .select()
    .eq('school_id', schoolId)
    .limit(1000000);

  if (error) {
    console.log(error);
  }
  else {
    console.log("Successfully fetched risk data rows");
    console.log(data);
    return data;
  }
}
