type AccountConfig = {
    id: string;
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
};

type AccountState = {
    id: string;
    connected: boolean;
    lastSync?: string;
    folders?: string[];
    error?: string;
};


type ReplyTemplate = {
    id: string;
    label: string;
    text: string;
};

interface EmailDoc {
  subject: string;
  text: string;
  from: string;
  folder: string;
  date: string;
  accountId: string;
  category?: string;
  [key: string]: any;
}

interface InterestedWebhookPayload {
  type: "interested_email";
  accountId: string;
  folder: string;
  subject: string;
  from: string;
  date: string;
  messageId: string;
  preview: string;
  receivedAt: string;
}
interface SearchQuery {
  q?: string;
  from?: string;
  folder?: string;
  after?: string;
  before?: string;
  page?: string;
  size?: string;
  accountId?: string;
  category?: string;
}


