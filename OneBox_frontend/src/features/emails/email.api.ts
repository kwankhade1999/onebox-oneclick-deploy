import { http } from "../../services/http";

export const searchEmails = (params: string) =>
  http.get(`http://localhost:3000/api/search?${params}`);

export const generateReply = (id: string) =>
  http.post(`http://localhost:3000/api/reply/${id}/suggest-reply`);
