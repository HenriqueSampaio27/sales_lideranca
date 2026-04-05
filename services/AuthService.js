import axios from "axios";

export const baseUrl = "http://192.168.3.120:5000"

export const login = async (username, password) => {

  const response = await axios.post(`${baseUrl}/login`, {
    username,
    password,
  });

  return response.data;
};
