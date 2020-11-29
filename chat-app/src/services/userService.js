import axios from "axios";

import { baseUrl } from "./../constants/endpoint";

export const fetchUsers = async () => {
  const url = `${baseUrl}/users`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    throw e;
  }
};
