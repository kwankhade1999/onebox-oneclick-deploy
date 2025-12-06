 import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const config = {

  port: parseInt(process.env.PORT || "3000", 10),

 
  openaiKey: requireEnv("OPENAI_API_KEY"),


  slackWebhook: requireEnv("SLACK_WEBHOOK_URL"),
  interestedWebhook: requireEnv("WEBHOOK_TEST_URL"),

 
  esNode: requireEnv("ES_NODE"),


  qdrantURL: requireEnv("QDRANT_URL"),
  qdrantCollection: requireEnv("QDRANT_COLLECTION"),
  qdrantVectorSize: parseInt(requireEnv("QDRANT_VECTOR_SIZE"), 10),
};

console.log("Environment loaded successfully");
