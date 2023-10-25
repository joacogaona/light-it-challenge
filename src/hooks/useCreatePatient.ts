import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient } from '../api/patients';
import { Patient } from '../types/patients';
import {  saveDataToLocalStorage } from '../utils/localStorageHelper';

type useCreatePatientProps = {
    setFile:(arg:File | null)=>void,
    setIsLoading:(arg:boolean)=>void,
    setShowSuccessModal:(arg:boolean)=>void,
    setErrorMessage:(arg:string)=>void,
    setShowErrorModal:(arg:boolean)=>void

}

const useCreatePatient = ({setFile,setIsLoading,setShowSuccessModal,setErrorMessage,setShowErrorModal}:useCreatePatientProps) => {
  const queryClient = useQueryClient();
  
 return useMutation({
    mutationFn: (patient: Patient) => {
        return createPatient(patient)
    },
    onSuccess: (newPatient) => {
        saveDataToLocalStorage({key:"patients",data:newPatient.data})
        queryClient.invalidateQueries({ queryKey: ['patients'] })
        setFile(null)
        setIsLoading(false)
        setShowSuccessModal(true);
    },
    onError: (error) => {
        setIsLoading(false)
        setErrorMessage(error?.response?.data?.message || "An error occurred! Please try again later.");
        setShowErrorModal(true);
    }
})
}

export default useCreatePatient;





