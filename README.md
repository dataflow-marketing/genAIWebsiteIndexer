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

### Configuration

```
ELASTIC_HOST: Elasticsearch host
ELASTIC_HTTP_AUTH_USERNAME: Elasticsearch username
ELASTIC_HTTP_AUTH_PASSWORD: Elasticsearch password
ELASTIC_INDEX:  Elasticsearch index

SITEMAP_URL: URL of the sitemap
SITEMAP_MAX_REQUESTS: The maximum number of requests

CLOUDFLARE_AI_ACCOUNTID: Cloudflare account
CLOUDFLARE_AI_TOKEN: Cloudflare token
CLOUDFLARE_AI_MODEL: Cloudflare AI Model
CLOUDFLARE_AI_CONTENT_SYSTEM: Describe the behavior or personality, for example "You are a friendly assistant"
CLOUDFLARE_AI_CONTENT_USER: Prompt
```


