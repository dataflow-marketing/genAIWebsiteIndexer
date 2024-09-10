import _ from 'underscore';
import { CheerioCrawler, Sitemap } from 'crawlee';
import { Client } from '@elastic/elasticsearch';
import got from 'got';

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

      let result = null;
      if (process.env.USE_AI === 'true') {
        const response = await got.post(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_AI_ACCOUNTID}/ai/run/${process.env.CLOUDFLARE_AI_MODEL}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_AI_TOKEN}`,
              'content-type': 'application/json',
            },
            json: {
              messages: [
                { role: 'system', content: `${process.env.CLOUDFLARE_AI_CONTENT_SYSTEM}` },
                { role: 'user', content: `${process.env.CLOUDFLARE_AI_CONTENT_USER} ${text}` },
              ],
            },
          }
        );
        result = JSON.parse(JSON.parse(response.body).result.response).interests;
      }

      await client.index({
        index: process.env.ELASTIC_INDEX,
        refresh: true,
        body: {
          url: request.url,
          text: text,
          interests: result,
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
