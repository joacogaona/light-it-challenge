
import './App.css'
import { useQuery } from '@tanstack/react-query';
import NewPatientForm from './NewPatientForm';
import { useState } from 'react';
import Modal from './components/Modal';
import { fetchPatients } from './api/patients';
import { Patient } from './types/patients';




const PatientCard = ({ patient }: { patient: Patient }) => {
  const { firstName, lastName, documentUrl, email, countryCode, phoneNumber } = patient
  return <li className='w-2/3 m-auto'  >
    <details className='border-solid border-x border-y border-white rounded-lg p-2 my-2'>
      <summary className='flex items-center' >
        <p className='mr-6 w-2/12'>{firstName}</p>
        <p className='mr-6 w-2/12'>{lastName}</p>
        <img src={documentUrl} height="50" width="50" />
      </summary>
      <div className='text-start'>
        <p >Email: {email}</p>
        <p>Country code: +{countryCode}</p>
        <p>Phone number: {phoneNumber}</p>
      </div>
    </details>
  </li>
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => fetchPatients()
  });

  function handleModal(isOpen: boolean) {
    setIsModalOpen(isOpen)
  }

  return (
    <div >
      <Modal isVisible={isModalOpen} onClose={() => handleModal(false)}>
        <NewPatientForm handleClose={() => handleModal(false)} />
      </Modal>
      {patients?.length > 0 ? <div className='flex w-2/3 m-auto justify-between'>
        <h1>Patient List</h1>
        <button className="bg-indigo-600" onClick={() => handleModal(true)}>Add new Patient</button>
      </div> :
        <h2 >There are no patients yet! <button onClick={() => handleModal(true)} >Add a new patient.</button></h2>}
      <ul>
        {
          patients?.map((patient: Patient) => {
            return <PatientCard key={patient.id} patient={patient} />
          })
        }
      </ul>
    </div>
  )
}

export default App
