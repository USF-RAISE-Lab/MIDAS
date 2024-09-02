'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import { DropRowsBySchoolId, UploadDataToSupabase } from '../api/data/uploadSchoolData';
import { getSession, SessionContext, SessionProvider, useSession } from 'next-auth/react';

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

export const convertCsvToJson = async (data: ArrayBuffer) => {
  // Get current user school_id to append to json
  const session = await getSession();

  const workbook = read(data, { dense: true });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const JSONdata: any[] = utils.sheet_to_json(sheet);

  console.log("JSON DATA")
  console.log(JSONdata)

  // Append school_id to json
  JSONdata.forEach((obj) => {
    obj.school_id = session?.user.school_id; // School id of user
  })


  DropRowsBySchoolId(session?.user.school_id);

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

      if (!file1) {
        toast.error('Missing fields');
        return;
      }

      const data1 = await file1.arrayBuffer();

      console.log("ABCBCBCB")
      // console.log(session)
      let uploadData: any = await convertCsvToJson(data1);
      console.log("UploadData")
      console.log(uploadData);

      
      UploadDataToSupabase(uploadData);

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





      schooLevel.setlistOfAllStudents(uploadData);




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
    <SessionProvider>
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
    </SessionProvider>
  );
};

export default FileModal;
