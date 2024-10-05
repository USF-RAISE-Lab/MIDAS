/**
 * This script is for adding a hashed password to a CSV that correlates to one School in the database.
 * It will also include the functions for comparing to the database and authorizing the upload.
 * If the User's School hashed access key does not match the CSV's, then they may not load the data.
 */

import { createClient } from "@supabase/supabase-js";
// import { hash } from "bcrypt";
import { getSession } from "next-auth/react";

// /**
//  * Insert a hashed password at line 0 of a CSV or txt file.
//  * @param password Plaintext password to be hashed.
//  * @param salt Salt count for hash function. Default = 10
//  */
// export async function AddHashedPasswordToCSV(password: string, salt: number = 10) {
//   const hashedPassword = await hash(password, salt);


//   // TODO: Add hashedPassword to beginning of file + '\n'
// }

// /**
//  * Read line 0 of file and compare the contents to user.school.access_key to check if authorized.
//  * @param file The CSV or txt file to check the password of.
//  */
// export function CompareCsvPasswordToUser(file: any) {
//   // TODO: Get session user.school.access_key and compare to row 0 of file to check if authorized.
//   //          If match, return true, else false
// }


const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

/**
 * Read file name and compare current session's school name
 */
export async function CompareSchoolNames(file: File) {
  const session = await getSession();

  let { data: isAdminData, error: isAdminError } = await supabase
    .rpc('get_is_admin_from_username', {
      _username: session?.user.name
    })
  if (isAdminError) console.error(isAdminError)
  else console.log(isAdminData)

  console.log(isAdminData.is_admin)
  if (isAdminData.is_admin) {
    return true;
  }

  // Get the user data from current session user.name
  let { data, error } = await supabase
    .rpc('get_school_name_from_username', {
      _username: session?.user.name
    })
  if (error) console.error(error)
  else console.log(data)

  const userSchoolName = data;

  const processedFileName = file!.name.replace(/\s+/g, '') // Replace all spaces with empty

  // console.log('Compared ', userSchoolName, ' to ', processedFileName, ' Is user permitted?', processedFileName.includes(userSchoolName))
  if (!processedFileName.includes(userSchoolName)) {
    console.log("User is not permitted to view this file.")
  }
  return (processedFileName.includes(userSchoolName))
}
