import { useEffect, useState } from "react";
import { searchEmails } from "./email.api";
import type { Email } from "./email.types";

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [category, setCategory] = useState("");
  const [accountFilter, setAccountFilter] = useState("");

  const loadEmails = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (fromFilter) params.append("from", fromFilter);
    if (category) params.append("category", category);
    if (accountFilter) params.append("accountId", accountFilter);

    const data = await searchEmails(params.toString());
    setEmails(data.results || []);

    setLoading(false);
  };

  useEffect(() => {
    loadEmails();
  }, []);

  return {
    emails,
    loading,
    q, setQ,
    fromFilter, setFromFilter,
    category, setCategory,
    accountFilter, setAccountFilter,
    loadEmails
  };
};
