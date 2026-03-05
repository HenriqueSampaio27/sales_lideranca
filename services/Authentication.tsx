import { useState } from "react";
import { login } from "./AuthService";


export async function handleLogin (username, password) {
  
  try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      alert("Login realizado!");
      return true;
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  };

const token = localStorage.getItem("token");