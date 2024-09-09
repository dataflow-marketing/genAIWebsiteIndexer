## genAIWebsiteIndexer

> Used to crawl website sitemaps, extract and process content using generative AI and then index the results with interest data into Elasticsearch.

## Install dependencies

```
$ npm install
```

## Run the app

```
$ dotenvx run --env-file=.env -- npm run start
```

## Environment Variables

### Elasticsearch Configuration
- `ELASTIC_HOST`: Elasticsearch host
- `ELASTIC_HTTP_AUTH_USERNAME`: Elasticsearch username
- `ELASTIC_HTTP_AUTH_PASSWORD`: Elasticsearch password
- `ELASTIC_INDEX`: Elasticsearch index

### Sitemap Configuration
- `SITEMAP_URL`: URL of the sitemap
- `SITEMAP_MAX_REQUESTS`: Maximum number of requests to make to the sitemap
- `CRAWL_MAXCONCURRENCY`: TMaximum concurrency
- `CRAWL_MAXREQUESTSPERMINUTE`: Maximum Requests Per Minute
- `HTML_SELECTORS`: Content to select from the HTML (e.g. jJQuery like selectors in the format "H1, H2, H3, .gh-article-excerpt, .gh-content")


### Cloudflare AI Configuration
- `USE_AI`: true
- `CLOUDFLARE_AI_ACCOUNTID`: Cloudflare account ID
- `CLOUDFLARE_AI_TOKEN`: Cloudflare token
- `CLOUDFLARE_AI_MODEL`: Cloudflare AI model to use
- `CLOUDFLARE_AI_CONTENT_SYSTEM`: Description of AI assistant behavior or personality (e.g., "You are a friendly assistant")
- `CLOUDFLARE_AI_CONTENT_USER`: User prompt or input
