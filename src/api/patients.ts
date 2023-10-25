import axios from "axios";
import { Patient } from "../types/patients";

async function fetchPatients() {
    const res = await axios.get(
      `http://localhost:3001/api/v1/patients`
    );
    return res.data;
  }

  async function createPatient(patient:Patient) {
    return  axios.post('http://localhost:3001/api/v1/patients', patient)
  }



  export {fetchPatients,createPatient}