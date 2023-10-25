import axios from "axios";

export async function uploadImage({formData}:{formData:globalThis.FormData}) {
    return await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData)
    
  }

