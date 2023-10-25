import { Fragment, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "./components/ErrorMessage";
import Modal from "./components/Modal";
import { CountrySelector } from 'react-international-phone';
import 'react-international-phone/style.css';
import useCreatePatient from "./hooks/useCreatePatient";
import { FILETYPES } from "./constants";
import { uploadImage } from "./api/images";



type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: {
        iso2: string;
        dialCode: string;
    };
    phoneNumber: string;
    document?: ImageData

}

type InputFieldProps = {
    register: { [key: string]: unknown },
    placeholder: string,
    errorMessage: string,
    hasError: boolean
}

const InputField = ({ register, placeholder, errorMessage, hasError }: InputFieldProps) => {
    return <><input className="my-2 bg-inherit border-x border-y  border-slate-600/50 rounded-lg p-2 " placeholder={placeholder} {...register} />
        {hasError ? <ErrorMessage message={errorMessage} /> : null}
    </>
}


export default function NewPatientForm({ handleClose }: { handleClose: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleChange = (file: File) => {
        setFile(file);
    };

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<FormData>()
    const createMutation = useCreatePatient({ setFile, setIsLoading, setShowSuccessModal, setErrorMessage, setShowErrorModal })
    const submitData = async (data: FormData) => {
        try {
            delete data.document
            if (file) {
                setIsLoading(true)
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME)
                const imageRes = await uploadImage({ formData })
                createMutation.mutate({ ...data, countryCode: data.countryCode.dialCode, documentUrl: imageRes?.data.url })
                reset()
            }
        } catch (e) {
            setErrorMessage("An error occurred uploading the image. Please try again later.");
            setShowErrorModal(true);
            setIsLoading(false)
        }
    }


    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    return <Fragment>
        <Modal isVisible={showSuccessModal} onClose={closeSuccessModal}>
            <p>Patient has been added successfully!</p>
            <button onClick={closeSuccessModal}>Close</button>
        </Modal>
        <Modal isVisible={showErrorModal} onClose={closeErrorModal}>
            <p>{errorMessage}</p>
            <button onClick={closeErrorModal}>Close</button>
        </Modal>
        <form className="flex flex-col" onSubmit={handleSubmit(submitData)}>
            <InputField placeholder="First name" hasError={!!errors.firstName} errorMessage={errors.firstName?.type === 'required' ? "First name is required" : "Invalid first name. Please use only letters."} register={{ ...register("firstName", { required: true, pattern: /^[a-zA-Z]+$/i }) }} />
            <InputField placeholder="Last name" hasError={!!errors.lastName} errorMessage={errors.lastName?.type === 'required' ? "Last name is required" : "Invalid last name. Please use only letters."} register={{ ...register("lastName", { required: true, pattern: /^[a-zA-Z]+$/i }) }} />
            <InputField placeholder="Email" hasError={!!errors.email} errorMessage={errors.email?.type === 'required' ? "Email is required" : 'Invalid email address. Please use only "@gmail.com" emails.'} register={{ ...register("email", { required: true, pattern: /^[\w.+\-]+@gmail\.com$/i }) }} />
            <div className="flex items-center">
                <Controller
                    control={control}
                    name="countryCode"
                    rules={{ required: true }}
                    render={({ field }) => {
                        if (!field?.value?.dialCode) {
                            field.value = { iso2: "au", dialCode: '61' }
                        }
                        return <CountrySelector
                            selectedCountry={field?.value?.iso2}
                            onSelect={({ iso2, dialCode }) => {
                                field.onChange({ iso2, dialCode })
                            }}
                        />
                    }}
                />
                {errors.countryCode?.type === 'required' && <ErrorMessage message="Country code is required" />}
                <InputField placeholder="Phone number" hasError={!!errors.phoneNumber} errorMessage={errors.email?.type === 'required' ? "Phone is required" : ''} register={{ ...register("phoneNumber", { required: true }) }} />
            </div>
            <Controller
                control={control}
                name="document"
                defaultValue={undefined}
                rules={{ required: true }}
                render={({ field }) => (
                    <>
                        {file ? (
                            <>
                                <img
                                    className="fit-picture max-w-[10%] max-h-20 m-auto"
                                    src={URL.createObjectURL(file)}
                                    alt="Patient profile picture"
                                />
                                <button className="w-4/12 m-auto mt-2 " onClick={() => {
                                    setFile(null);
                                    field.onChange(null);
                                }}>
                                    Remove image
                                </button>
                            </>
                        ) : (
                            <FileUploader
                                handleChange={(selectedFile: File) => {
                                    handleChange(selectedFile);
                                    field.onChange(selectedFile);
                                }}
                                name="file"
                                types={FILETYPES}
                                multiple={false}
                            />
                        )}
                    </>
                )}
            />
            {errors.document && <ErrorMessage message="Document image is required" />}
            <div className=" flex w-1/2 place-self-end mt-4 justify-around">
                <button disabled={isLoading} onClick={handleClose} >Cancel</button>
                <button className="bg-indigo-600" type="submit" disabled={isLoading} >{isLoading ? "Adding..." : "Add patient"}</button>
            </div>
        </form>
    </Fragment>

}