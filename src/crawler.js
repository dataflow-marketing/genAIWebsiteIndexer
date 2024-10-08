import _ from 'underscore';
import { CheerioCrawler, Sitemap } from 'crawlee';
import { Client } from '@elastic/elasticsearch';
import { fetchGenAI } from './genAIHandlers/fetchGenAI.js';


// Elasticsearch client initialization
const client = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    username: process.env.ELASTIC_HTTP_AUTH_USERNAME,
    password: process.env.ELASTIC_HTTP_AUTH_PASSWORD,
  },
});

export async function runCrawler() {
  const crawler = new CheerioCrawler({
    async requestHandler({ request, log, $ }) {
      let text = '';
      process.env.HTML_SELECTORS.split(', ').forEach((selector) => {
        text += $(selector).text().trim() + ' ';
      });
      text = text.trim();

      let genAIInterests = null;
      if (process.env.USE_GENAI_INTERESTS === 'true') {
        genAIInterests = await fetchGenAI(process.env.GENAI_INTERESTS_PROMPT,text); 
      }

      let genAICTA = null;
      if (process.env.USE_GENAI_CTA === 'true') {
        genAICTA = await fetchGenAI(process.env.GENAI_CTA_PROMPT,text); 
      }

      console.log(genAICTA);

      await client.index({
        index: process.env.ELASTIC_INDEX,
        refresh: true,
        body: {
          url: request.url,
          text: text,
          interests: genAIInterests.interests,
          cta: genAICTA.cta,
        },
      });
    },
    maxConcurrency: Number(process.env.CRAWL_MAXCONCURRENCY),
    maxRequestsPerMinute: Number(process.env.CRAWL_MAXREQUESTSPERMINUTE),
  });

  const { urls } = await Sitemap.load(process.env.SITEMAP_URL);

  try {
    const body = await client.search({
      index: process.env.ELASTIC_INDEX,
      body: {
        size: 0,
        _source: false,
        aggs: {
          unique_urls: {
            terms: {
              field: 'url.keyword',
              size: 1000000,
            },
          },
        },
      },
    });

    const difference = _.difference(urls, _.map(body.aggregations.unique_urls.buckets, 'key'));
    await crawler.addRequests(_.first(difference, process.env.SITEMAP_MAX_REQUESTS));
  } catch {
    await crawler.addRequests(_.first(urls, process.env.SITEMAP_MAX_REQUESTS));
  }

  await crawler.run();
}
