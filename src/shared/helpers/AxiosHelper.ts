import axios from "axios";

export const axiosRequetsForGet = async (url: string) => {
  try {    
    return await axios.get(url);
  } catch (error) {
    throw new Error(error);
  }
};
