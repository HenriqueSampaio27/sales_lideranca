import axios from "axios";

export const login = async (username, password) => {

  const base = "https://sales-backend-7q5y.onrender.com"

  const response = await axios.post(`${base}/login`, {
    username,
    password,
  });

  return response.data;
};
