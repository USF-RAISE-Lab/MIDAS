/**
 * This file contains api functions regarding downloading and loading school data from Supabase on 
 * user login. Will also be used during batch export to CSV.
 *
 * @author Gabriel Hooks
 * @since 2024-09-06
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

/**
 * Fetch student data from public.schooldata
 * Includes student demographics, test scores, discplinary action data
 */
export async function FetchSchoolData(schoolId: number) {
  const { data, error } = await supabase
    .from('schooldata')
    .select()
    .eq('school_id', schoolId)

  if (error) {
    console.log(error);
  }
  else {
    console.log("Successfully fetched schooldata rows")
    return data;
  }
}

