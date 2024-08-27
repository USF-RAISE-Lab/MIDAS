'use client';
import React, { useCallback, useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useFileModal from '@/hooks/useFileModal';
import { read, utils } from 'xlsx';
import {
  getConfidenceLvel,
  getmyRiskStatsSchoolLevel,
  getDemographic,
} from '@/action/getSchoolLevelFunctions';
import {
  getMyRiskStatsGradeLevel,
  getDemographicGradeLevel,
  getConfidenceLevelForGradeLevel,
} from '@/action/getGradeLevelFunctions';
import useSchoolLevel from '@/hooks/useSchoolLevel';
import { BounceLoader } from 'react-spinners';

import { CompareSchoolNames } from '../api/file-auth/restrict-csv';
import useGradeLevel from '@/hooks/useGradeLevel';
import useClassLevel from '@/hooks/useClassLevel';

import { useDropzone } from 'react-dropzone';

import { AiOutlineCloudUpload } from 'react-icons/ai';

const data_frame: string[] = [
  'odr_f',
  'susp_f',
  'gender',
  'ethnicity',
  'ell',
  'schoollevel',
  'math_f',
  'read_f',
  'mysaebrs_emo',
  'mysaebrs_soc',
  'mysaebrs_aca',
  'saebrs_emo',
  'saebrs_soc',
  'saebrs_aca',
];

export const convertCsvToJson = (data: ArrayBuffer) => {
  const workbook = read(data, { dense: true });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const JSONdata: any[] = utils.sheet_to_json(sheet);

  return JSONdata;
};

/**
 * This function matching with risk factor
 */
export const setSecondMatchingRiskFactor = (
  uploadData: any,
  riskFactorData: any,
  riskFactor: string,
  confidenceFactor: string,
) => {
  const m: any = new Map();

  //x is one row in the data?
  uploadData.forEach(function (x: any) {
    x[riskFactor] = null;
    x[confidenceFactor] = null;
    m.set(x.id, x);
  });

  riskFactorData.forEach(function (x: any) {
    var existing = m.get(x.id);
    if (existing) {
      existing[riskFactor] = x.risk_level;
      existing[confidenceFactor] = x.confidence;
      Object.assign(existing);
    }
  });

  var result = Array.from(m.values());
  return result;
};

const FileModal = () => {
  // const [fileEnter, setFileEnter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>();
  const fileModal = useFileModal();
  const router = useRouter();
  const schooLevel = useSchoolLevel();
  const gradeLevel = useGradeLevel();
  const classLevel = useClassLevel();

  //handle form
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FieldValues>({
      defaultValues: {
        document1: null,
      },
    });

  //watch the file change
  const selectedFile = watch('document1');

  //onDrop is a argument for react dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setValue('document1', acceptedFiles, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/csv': ['.csv'],
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      fileModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      let file1: File = values.document1?.[0];

      // For checking file name - not good security
      // if ((await CompareSchoolNames(file1)) == false) {
      //   toast.error('You are not permitted to open this file');
      //   // throw(new Error("User is not permitted to open this file."))
      //   return;
      // }

      if (!file1) {
        toast.error('Missing fields');
        return;
      }

      const data1 = await file1.arrayBuffer();
      // const data2 = await file2.arrayBuffer();
      // const data3 = await file3.arrayBuffer();
      // const data4 = await file4.arrayBuffer();
      // const data5 = await file5.arrayBuffer();
      // const data6 = await file6.arrayBuffer();

      let uploadData: any = convertCsvToJson(data1);

      // const inputData: any = convertCsvToJson(data2);

      // const mathRiskData: any = convertCsvToJson(data3);

      // const readRiskData: any = convertCsvToJson(data4);

      // //get ODR data
      // const odrRiskData: any = convertCsvToJson(data6);

      // const suspRiskData: any = convertCsvToJson(data5);

      // const m: any = new Map();
      // uploadData.forEach(function (x: any) {
      //   x.id = null;
      //   m.set(
      //     `${x.odr_f},${x.susp_f},${x.gender},${x.ethnicity},${x.ell},${x.schoollevel},${x.math_f},${x.read_f},${x.mysaebrs_emo},${x.mysaebrs_soc},${x.mysaebrs_aca},${x.saebrs_emo},${x.saebrs_soc},${x.saebrs_aca}`,
      //     x,
      //   );
      // });

      // inputData.forEach(function (x: any) {
      //   var existing = m.get(
      //     `${x.odr_f},${x.susp_f},${x.gender},${x.ethnicity},${x.ell},${x.schoollevel},${x.math_f},${x.read_f},${x.mysaebrs_emo},${x.mysaebrs_soc},${x.mysaebrs_aca},${x.saebrs_emo},${x.saebrs_soc},${x.saebrs_aca}`,
      //   );
      //   if (existing) {
      //     const a = { id: x.id };
      //     Object.assign(existing, a);
      //   }
      // });

      // uploadData = structuredClone(Array.from(m.values()));

      // //deep clone the array after matching

      // // //filter for math risk
      // const mathRisk = setSecondMatchingRiskFactor(
      //   uploadData,
      //   mathRiskData,
      //   'math_risk',
      //   'math_confidence',
      // );

      // // //filter for read risk
      // const readRisk = setSecondMatchingRiskFactor(
      //   uploadData,
      //   readRiskData,
      //   'read_risk',
      //   'read_confidence',
      // );

      // const odrRisk = setSecondMatchingRiskFactor(
      //   uploadData,
      //   odrRiskData,
      //   'odr_risk',
      //   'odr_confidence',
      // );

      // // //filter for suspension risk
      // const suspRisk = setSecondMatchingRiskFactor(
      //   uploadData,
      //   suspRiskData,
      //   'susp_risk',
      //   'susp_confidence',
      // );

      //mysaeber Emotion Risk
      schooLevel.setMySaebrsEmotional(
        getmyRiskStatsSchoolLevel(uploadData, 'mysaebrs_emo', 'MySaebrs'),
      );

      //saeber Emotion Risk
      schooLevel.setSaebrsEmotional(
        getmyRiskStatsSchoolLevel(uploadData, 'saebrs_emo', 'Saebrs'),
      );

      //Saeber Academic Risk
      schooLevel.setMySaebrsAcademic(
        getmyRiskStatsSchoolLevel(uploadData, 'mysaebrs_aca', 'MySaebrs'),
      );

      //Mysaeber Academic Risk
      schooLevel.setSaebrsAcademic(
        getmyRiskStatsSchoolLevel(uploadData, 'saebrs_aca', 'Saebrs'),
      );

      //Saeber Social Risk
      schooLevel.setSaebrsSocial(
        getmyRiskStatsSchoolLevel(uploadData, 'saebrs_soc', 'Saebrs'),
      );
      //Mysaeber Social Risk
      schooLevel.setMySaebrsSocial(
        getmyRiskStatsSchoolLevel(uploadData, 'mysaebrs_soc', 'MySaebrs'),
      );

      // schooLevel.setRiskMath(
      //   getmyRiskStatsSchoolLevel(suspRisk, 'math_risk', 'math_risk'),
      // );

      // schooLevel.setRiskReading(
      //   getmyRiskStatsSchoolLevel(suspRisk, 'read_risk', 'read_risk'),
      // );

      // schooLevel.setRiskSuspension(
      //   getmyRiskStatsSchoolLevel(suspRisk, 'susp_risk', 'susp_risk'),
      // );

      // //set ODR for school level
      // schooLevel.setRiskODR(
      //   getmyRiskStatsSchoolLevel(suspRisk, 'odr_risk', 'odr_risk'),
      // );

      // schooLevel.setConfidenceLevel(getConfidenceLvel(suspRisk));

      schooLevel.setlistOfAllStudents(uploadData);

      // schooLevel.setGenderRisk(getDemographic(suspRisk, 'gender'));

      // schooLevel.setEllRisk(getDemographic(suspRisk, 'ell'));

      // schooLevel.setEthnicityRisk(getDemographic(suspRisk, 'ethnicity'));

      //mysaeber Emotion Risk
      gradeLevel.setMySaebrsEmotional(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'mySaebrsEmotional'),
      );

      //saeber Emotion Risk
      gradeLevel.setSaebrsEmotional(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'saebrsEmotional'),
      );

      //MySaeber Academic Risk
      gradeLevel.setMySaebrsAcademic(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'mySaebrsAcademic'),
      );

      //Saeber Academic Risk
      gradeLevel.setSaebrsAcademic(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'saebrsAcademic'),
      );

      //Mysaeber Social Risk
      gradeLevel.setMySaebrsSocial(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'mySaebrsSocial'),
      );
      //saeber Social Risk
      gradeLevel.setSaebrsSocial(
        getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'saebrsSocial'),
      );

      // gradeLevel.setRiskMath(
      //   getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'math_risk'),
      // );

      // gradeLevel.setRiskReading(
      //   getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'read_risk'),
      // );

      // gradeLevel.setRiskSuspension(
      //   getMyRiskStatsGradeLevel(uploadData, 'gradelevel', 'susp_risk'),
      // );

      // gradeLevel.setRiskODR(
      //   getMyRiskStatsGradeLevel(suspRisk, 'gradelevel', 'odr_risk'),
      // );

      // gradeLevel.setConfidenceLevel(
      //   getConfidenceLevelForGradeLevel(suspRisk, 'gradelevel'),
      // );

      // gradeLevel.setGenderRisk(
      //   getDemographicGradeLevel(suspRisk, 'gradelevel', 'gender'),
      // );

      // gradeLevel.setEthnicityRisk(
      //   getDemographicGradeLevel(suspRisk, 'gradelevel', 'ethnicity'),
      // );

      // gradeLevel.setEllRisk(
      //   getDemographicGradeLevel(suspRisk, 'gradelevel', 'ell'),
      // );

      //classroom

      //mysaeber Emotion Risk
      classLevel.setMySaebrsEmotional(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'mySaebrsEmotional'),
      );

      //saeber Emotion Risk
      classLevel.setSaebrsEmotional(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'saebrsEmotional'),
      );

      //MySaeber Academic Risk
      classLevel.setMySaebrsAcademic(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'mySaebrsAcademic'),
      );

      //Saeber Academic Risk
      classLevel.setSaebrsAcademic(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'saebrsAcademic'),
      );

      //Mysaeber Social Risk
      classLevel.setMySaebrsSocial(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'mySaebrsSocial'),
      );
      //saeber Social Risk
      classLevel.setSaebrsSocial(
        getMyRiskStatsGradeLevel(uploadData, 'classroom', 'saebrsSocial'),
      );

      // classLevel.setRiskMath(
      //   getMyRiskStatsGradeLevel(suspRisk, 'classroom', 'math_risk'),
      // );

      // classLevel.setRiskReading(
      //   getMyRiskStatsGradeLevel(suspRisk, 'classroom', 'read_risk'),
      // );

      // classLevel.setRiskSuspension(
      //   getMyRiskStatsGradeLevel(suspRisk, 'classroom', 'susp_risk'),
      // );

      // classLevel.setConfidenceLevel(
      //   getConfidenceLevelForGradeLevel(suspRisk, 'classroom'),
      // );

      // classLevel.setGenderRisk(
      //   getDemographicGradeLevel(suspRisk, 'classroom', 'gender'),
      // );

      // classLevel.setEthnicityRisk(
      //   getDemographicGradeLevel(suspRisk, 'classroom', 'ethnicity'),
      // );

      // classLevel.setEllRisk(
      //   getDemographicGradeLevel(suspRisk, 'classroom', 'ell'),
      // );

      // classLevel.setRiskODR(
      //   getMyRiskStatsGradeLevel(suspRisk, 'classroom', 'odr_risk'),
      // );

      router.refresh();
      setIsLoading(false);
      toast.success('File uploaded');
      reset();
      fileModal.onClose();
    } catch (error) {
      toast.error('Somthing went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Uploading a Document"
        description=""
        isOpen={fileModal.isOpen}
        onChange={onChange}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-y-4"
        >
          <div
            {...getRootProps()}
            className={` item-center flex h-72 w-full flex-col justify-center border-2 border-dashed p-3 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <AiOutlineCloudUpload size={50} className="mx-auto" />
            {selectedFile && selectedFile[0] ? (
              <p className="mb-4 text-sm text-gray-500">
                Selected file: {selectedFile[0].name}
              </p>
            ) : (
              <p>
                {isDragActive ? (
                  <span>
                    <b>Drop the document to get started</b> or click
                  </span>
                ) : (
                  <span>
                    <b>Click to Choose School File ( .xlsx or .csv )</b> or drag
                    it here
                  </span>
                )}
              </p>
            )}

            <Input
              className="hidden"
              {...getInputProps}
              id="document1"
              disabled={isLoading}
              {...register('document1', { required: true })}
            />
          </div>

          {isLoading ? (
            <BounceLoader className=" m-auto" color="blue" size={40} />
          ) : (
            <Button
              disabled={isLoading}
              type="submit"
              className="m-auto w-20 font-semibold"
            >
              Upload
            </Button>
          )}
        </form>
      </Modal>
    </>
  );
};

export default FileModal;
