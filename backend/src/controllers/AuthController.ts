import { Request, Response } from "express";
import users from "../datas/usuario.json";

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Credenciais inválidas. Verifique seu email e senha.",
    });
  }

  return res.json(user);
};