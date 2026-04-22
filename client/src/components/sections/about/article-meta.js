// pages/api/article-meta.js
// Fetches Open Graph metadata from the Times Now article server-side.
// This avoids CORS issues and keeps your API key / scraping logic off the client.

import axios from "axios";
import * as cheerio from "cheerio";

const ARTICLE_URL =
  "https://www.timesnownews.com/education/inspire-education-service-indias-premier-phd-guidance-platform-expands-global-footprint-article-112924264/amp";

export default async function handler(req, res) {
  // Cache response for 24 hours so you don't hammer the source site
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  try {
    const { data } = await axios.get(ARTICLE_URL, {
      headers: {
        // Mimic a real browser so the site doesn't block the request
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 8000,
    });

    const $ = cheerio.load(data);

    // Pull Open Graph tags
    const meta = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        "INSPIRE Education Service: India's Premier PhD Guidance Platform Expands Global Footprint",
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "Founded by Ahammed Farzin, INSPIRE provides end-to-end PhD guidance to researchers across 17+ countries.",
      image:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        null,
      url:
        $('meta[property="og:url"]').attr("content") || ARTICLE_URL,
      siteName:
        $('meta[property="og:site_name"]').attr("content") || "Times Now News",
      publishedDate:
        $('meta[property="article:published_time"]').attr("content") ||
        $('meta[name="publish-date"]').attr("content") ||
        null,
    };

    return res.status(200).json(meta);
  } catch (error) {
    console.error("Article meta fetch error:", error.message);

    // Fallback data so the UI never breaks
    return res.status(200).json({
      title:
        "INSPIRE Education Service: India's Premier PhD Guidance Platform Expands Global Footprint",
      description:
        "Founded by Ahammed Farzin, INSPIRE provides end-to-end PhD guidance to researchers across 17+ countries.",
      image: null,
      url: ARTICLE_URL,
      siteName: "Times Now News",
      publishedDate: null,
    });
  }
}