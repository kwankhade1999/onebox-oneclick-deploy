export const http = {
  get: async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },

  post: async (url: string, body?: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }
};
