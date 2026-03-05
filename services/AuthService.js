import axios from "axios";

export const login = async (username, password) => {
  const response = await axios.post("http://localhost:5000/login", {
    username,
    password,
  });

  return response.data;
};
