import axios from "axios";
import { config } from "../config/env";


const QDRANT_URL = config.qdrantURL;
const COLLECTION = config.qdrantCollection;
const VECTOR_SIZE = Number(config.qdrantVectorSize || 1536);

/**
 * Axios client used for all Qdrant API requests.
 * @author Pranay Mahalle
 */
export const qdrant = axios.create({
  baseURL: QDRANT_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Ensures Qdrant collection exists; creates it if missing with required vector size + distance metric.
 * @author Pranay Mahalle
 */
export async function ensureCollection() {
  try {
    const res = await qdrant.get("/collections");

    const exists = res.data.result.collections.some(
      (c: { name: string }) => c.name === COLLECTION
    );

    if (exists) {
      console.log(`Qdrant: Collection '${COLLECTION}' already exists`);
      return;
    }

    console.log(`Qdrant: Creating collection '${COLLECTION}'...`);

    await qdrant.put(`/collections/${COLLECTION}`, {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
      },
    });

    console.log(`Qdrant: Collection '${COLLECTION}' created`);
  } catch (err: any) {
    console.error("Qdrant ensureCollection error:", err.response?.data || err);
    throw err;
  }
}

/**
 * Inserts or updates a vector and payload into the Qdrant collection.
 * @author Pranay Mahalle
 */
export async function upsertVector(
  id: string | number,
  vector: number[],
  payload: Record<string, any>
) {
  try {
    const res = await qdrant.put(`/collections/${COLLECTION}/points`, {
      points: [
        {
          id,
          vector,
          payload,
        },
      ],
    });

    return res.data;
  } catch (err: any) {
    console.error("Qdrant upsertVector error:", err.response?.data || err);
    throw err;
  }
}

/**
 * Performs vector similarity search in Qdrant and returns top matching results.
 * @author Pranay Mahalle
 */
export async function searchVector(vector: number[], limit = 5) {
  try {
    const res = await qdrant.post(`/collections/${COLLECTION}/points/search`, {
      vector,
      limit,
    });

    return res.data.result;
  } catch (err: any) {
    console.error("Qdrant searchVector error:", err.response?.data || err);
    throw err;
  }
}
