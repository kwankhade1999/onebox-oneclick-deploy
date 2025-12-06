import { Router } from "express";
import { esClient } from "../../../core/esClient";
import { SearchHit, SearchResponse } from "@elastic/elasticsearch/lib/api/types";


const router = Router();

/**
 * Searches emails in Elasticsearch using text, filters, pagination, and highlighting support.
 * Supports filters: q, from, folder, accountId, category, date range, page, size.
 * @author Pranay Mahalle
 */
router.get("/", async (req, res) => {
  const {
    q,
    from,
    folder,
    after,
    before,
    page = "0",
    size = "20",
    accountId,
    category,
  } = req.query as SearchQuery;

  const must: any[] = [];
  const filter: any[] = [];


  if (q && q.trim() !== "") {
    must.push({
      multi_match: {
        query: q,
        fields: ["subject^3", "text"],
        fuzziness: "AUTO",
      },
    });
  }


  if (from && from.trim() !== "") {
    filter.push({ match_phrase: { from } });
  }

  if (folder && folder.trim() !== "") {
    filter.push({ match_phrase: { folder } });
  }

  if (accountId && accountId.trim() !== "") {
    filter.push({ match_phrase: { accountId } });
  }

  if (category && category.trim() !== "") {
    filter.push({
      match_phrase: {category},
    });
  }


  if (after || before) {
    filter.push({
      range: {
        date: {
          ...(after ? { gte: after } : {}),
          ...(before ? { lte: before } : {}),
        },
      },
    });
  }

  try {
    const result: SearchResponse<EmailDoc> = await esClient.search({
      index: "emails",
      from: Number(page) * Number(size),
      size: Number(size),
      query: { bool: { must, filter } },
      highlight: {
        fields: {
          subject: {},
          text: {},
        },
      },
      sort: [
        { date: "desc" }
      ]
    });

    const total =
      typeof result.hits.total === "number"
        ? result.hits.total
        : result.hits.total?.value ?? 0;

    const results = result.hits.hits.map((hit: SearchHit<EmailDoc>) => ({
      id: hit._id,
      ...hit._source,
      highlight: hit.highlight,
    }));

    res.json({ ok: true, total, results });
  } catch (err: any) {
    console.error("Search error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
