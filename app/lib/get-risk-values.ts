/**
 * Functions to get Saebrs risk scores from useSchoolLevel, useGradeLevel, and useClassLevel.
 * 
 * @since 2024-08-10
 * @author Gabriel
 */

/**
 * Get Saebrs and MySaebrs risk values from a school level store, given a key.
 * Returns ['0%', '0%', '0%'] if there is no levelData or levelData[key]
 * 
 * @param levelData An object generated from the useSchoolLevel hook.
 * @param type 'Saebrs' or 'MySaebrs'
 * @param key The risk category to get. '...Social'|'...Emotional'|'...Academic'
 * @returns The low, some, and high risk levels of the selection, formatted as a percentage.
 */
export function getSchoolRiskValues(
  levelData: any, 
  type: 'Saebrs' | 'MySaebrs', 
  key: 'saebrsSocial' | 'mySaebrsSocial' | 'saebrsEmotional' | 'mySaebrsEmotional' | 'saebrsAcademic' | 'mySaebrsAcademic'
): [string, string, string] {

  if (!levelData || !levelData[key]) {
    return ['0%', '0%', '0%'];
  }
  
  return [
    levelData[key][type]?.['Low Risk']  ? levelData[key][type]['Low Risk']  + '%' : '0%',
    levelData[key][type]?.['Some Risk'] ? levelData[key][type]['Some Risk'] + '%' : '0%',
    levelData[key][type]?.['High Risk'] ? levelData[key][type]['High Risk'] + '%' : '0%',
  ];
}


/**
 * Get Saebrs and MySaebrs risk values from a grade level store, given a key.
 * Returns ['0%', '0%', '0%'] if there is no levelData or levelData[key]
 * 
 * @param levelData An object generated from the useGradeLevel hook.
 * @param grade Grade level string
 * @param key The risk category to get. '...Social'|'...Emotional'|'...Academic'
 * @returns The low, some, and high risk levels of the selection, formatted as a percentage.
 */
export function getGradeRiskValues(
  levelData: any, 
  grade: string,
  key: 'saebrsSocial' | 'mySaebrsSocial' | 'saebrsEmotional' | 'mySaebrsEmotional' | 'saebrsAcademic' | 'mySaebrsAcademic'
): [string, string, string] {

  if (!levelData || !levelData[key]) {
    return ['0%', '0%', '0%'];
  }
  
  return [
    levelData[key][grade][key]?.['Low Risk']  ? levelData[key][grade][key]['Low Risk']  + '%' : '0%',
    levelData[key][grade][key]?.['Some Risk'] ? levelData[key][grade][key]['Some Risk'] + '%' : '0%',
    levelData[key][grade][key]?.['High Risk'] ? levelData[key][grade][key]['High Risk'] + '%' : '0%',
  ];
}


/**
 * Get Saebrs and MySaebrs risk values from a class level store, given a key.
 * Returns ['0%', '0%', '0%'] if there is no levelData or levelData[key]
 * 
 * @param levelData An object generated from the useClassLevel hook.
 * @param classroom Classroom name string
 * @param key The risk category to get. '...Social'|'...Emotional'|'...Academic'
 * @returns The low, some, and high risk levels of the selection, formatted as a percentage.
 */
export function getClassRiskValues(
  levelData: any, 
  classroom: string,
  key: 'saebrsSocial' | 'mySaebrsSocial' | 'saebrsEmotional' | 'mySaebrsEmotional' | 'saebrsAcademic' | 'mySaebrsAcademic'
): [string, string, string] {

  if (!levelData || !levelData[key]) {
    return ['0%', '0%', '0%'];
  }
  
  return [
    levelData[key][classroom][key]?.['Low Risk']  ? levelData[key][classroom][key]['Low Risk']  + '%' : '0%',
    levelData[key][classroom][key]?.['Some Risk'] ? levelData[key][classroom][key]['Some Risk'] + '%' : '0%',
    levelData[key][classroom][key]?.['High Risk'] ? levelData[key][classroom][key]['High Risk'] + '%' : '0%',
  ];
}