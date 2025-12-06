import { http } from "../../services/http";

export const fetchAccounts = () =>
  http.get("http://localhost:3000/api/status");

export const addAccount = (payload: any) =>
  http.post("http://localhost:3000/api/accounts", payload);
