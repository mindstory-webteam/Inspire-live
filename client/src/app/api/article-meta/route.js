// src/app/api/article-meta/route.js
// Next.js App Router route handler — no separate backend needed.
// This runs server-side inside your existing Next.js app.

import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

const ARTICLE_URL =
  "https://www.timesnownews.com/education/inspire-education-service-indias-premier-phd-guidance-platform-expands-global-footprint-article-112924264/amp";

export async function GET() {
  try {
    const { data } = await axios.get(ARTICLE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 8000,
    });

    const $ = cheerio.load(data);

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
      url: $('meta[property="og:url"]').attr("content") || ARTICLE_URL,
      siteName:
        $('meta[property="og:site_name"]').attr("content") || "Times Now News",
      publishedDate:
        $('meta[property="article:published_time"]').attr("content") || null,
    };

    return NextResponse.json(meta, {
      headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate" },
    });
  } catch (error) {
    // Always return fallback so the UI never breaks
    return NextResponse.json({
      title:
        "INSPIRE Education Service: India's Premier PhD Guidance Platform Expands Global Footprint",
      description:
        "Founded by Ahammed Farzin in Palakkad, Kerala, INSPIRE has grown into India's No. 1 PhD guidance platform, trusted by researchers across 17+ countries.",
      image: null,
      url: ARTICLE_URL,
      siteName: "Times Now News",
      publishedDate: null,
    });
  }
}