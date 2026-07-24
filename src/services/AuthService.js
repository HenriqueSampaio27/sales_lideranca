import axios from "axios";

export const baseUrl =
  "http://10.0.0.148:5000";

export const login = async (
  username,
  password
) => {
  const response =
    await axios.post(
      `${baseUrl}/login`,
      {
        username,
        password,
      }
    );

  const data = response.data;

  // salva usuário logado
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data;
};