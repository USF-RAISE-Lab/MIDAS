/**
 * Upload data via CSV to Supabase schooldata table.
 * I am doing this approach because we need the table loaded into the DB to perform
 * inner joins. This will also prevent the need of performing the same operation of two large inner
 * joins more than once.
 * 
 * Steps:
 * - FileModal opens,
 * - User drags in csv
 * - csv is parsed to JSON and loaded into memory
 * - ? Add userid to each JSON object in array
 * - Drop rows where schoolid = (user.schoolid where user.id = session.userid)
 * - Copy JSON array data to table with id
 * - Perform inner join between webinput table and this table where school_id = (user.school_id where user.id = session.userid)
 * - Perform inner join between midasrisk table and this table
 * 
 * TODO: File Modal - Notify user that they only need to upload if they have new data. Maybe make check to see if the data is the
 *       same as the one in the table already to save on usage.
 * 
 * 
 */
import { createClient } from "@supabase/supabase-js";

 

const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

function ValidateColumns() {

}

/**
 * Drops all rows in schooldata which contain the school_id of the current user school_id.
 * This will be used upon file upload to prevent duplicate data.
 * 
 * This feels unsafe.
 */
export async function DropRowsBySchoolId(school_id: number) {
  console.log("START DROPPING ROWS");

  const {data, error} = await supabase
  .from('schooldata')
  .delete()
  .eq('school_id', school_id);

  if (error) {
    console.log("Error deleting rows ", error);
  }
  else {
    console.log("Deleted rows of school_id ", school_id);
  }
}

export async function UploadDataToSupabase(jsonArray: any) {
  console.log("ATTEMPTED UPLOAD")
  console.log(jsonArray)
  const { data, error } = await supabase
      .from('schooldata')
      .insert(jsonArray); // or 'representation' for full return

    if (error) {
      console.error('Error uploading data:', error);
      // Handle error (e.g., rollback, retry, log)
    }
}