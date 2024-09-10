## genAIWebsiteIndexer

> A tool used to crawl website sitemaps, extract and process content using generative AI, and then index the results with interest data into Elasticsearch. The tool also supports updating indexed documents by mapping interests to segments.

## Install dependencies

Before running the app, install the necessary dependencies:

```
$ npm install
```

## Run the app

The app is now modularized, allowing different functionalities to be run based on the command. Use the following commands to execute the desired functionality.

1. Crawl Sitemap and Index Content
This command will start crawling the sitemap, extracting text content based on specified HTML selectors, and optionally processing it with Cloudflare AI before indexing it into Elasticsearch.

```
$ dotenvx run --env-file=.env -- node app start crawl
```

2. List Unique Interests
This command lists unique interests.

```
$ dotenvx run --env-file=.env -- node app start listUniqueInterests
```

3. Create the Interest to Segment Mapping Object
This step requires that you use a genAI tool to create the mapping used for the `INTEREST_SEGMENT_MAPPING` environment variable.

For example use use the following prompt, adjust as required replacing the list of segments to your preferred segments and replace the list of interests with the output from the command `listUniqueInterests`.

```
For the following interests, suggest a segment that it can be mapped to.

Minify the output so that it can be passed as an env var like this INTEREST_SEGMENT_MAPPING='{"interest1":"segment1","interest2":"segment1","interest3":"segment2","interest4":"segment3"}'

Using these segments

segment1
segment2
segment3

Where the key is the interest and the value the segment.

Only include interests that are not popular or rare.

    {
          "key" : "interest0",
          "doc_count" : 99
        },
        {
          "key" : "interest1",
          "doc_count" : 55
        },
        {
          "key" : "interest2",
          "doc_count" : 50
        },
        {
          "key" : "interest3",
          "doc_count" : 45
        },
        {
          "key" : "interest4",
          "doc_count" : 1
        }
    }

```


4. Update Interests to Segments
This command updates existing Elasticsearch documents by mapping interests to predefined segments.

```
$ dotenvx run --env-file=.env -- node app start updateSegments
```

5. List Unique Segments
This command lists unique segments.

```
$ dotenvx run --env-file=.env -- node app start listUniqueSegments
```


## Environment Variables

### Elasticsearch Configuration
Required for all commands.

- `ELASTIC_HOST`: Elasticsearch host
- `ELASTIC_HTTP_AUTH_USERNAME`: Elasticsearch username
- `ELASTIC_HTTP_AUTH_PASSWORD`: Elasticsearch password
- `ELASTIC_INDEX`: Elasticsearch index

### Sitemap Configuration
Required for `crawl` command.

- `SITEMAP_URL`: URL of the sitemap
- `SITEMAP_MAX_REQUESTS`: Maximum number of requests to make to the sitemap
- `CRAWL_MAXCONCURRENCY`: TMaximum concurrency
- `CRAWL_MAXREQUESTSPERMINUTE`: Maximum Requests Per Minute
- `HTML_SELECTORS`: Content to select from the HTML, these are jJQuery like selectors in the format for example: "H1, H2, H3, .gh-article-excerpt, .gh-content"


### Cloudflare AI Configuration
Required for `crawl` command with using genAI to get interests.

- `USE_AI`: true
- `CLOUDFLARE_AI_ACCOUNTID`: Cloudflare account ID
- `CLOUDFLARE_AI_TOKEN`: Cloudflare token
- `CLOUDFLARE_AI_MODEL`: Cloudflare AI model to use
- `CLOUDFLARE_AI_CONTENT_SYSTEM`: Description of AI assistant behavior or personality, for example: "You are a friendly assistant"
- `CLOUDFLARE_AI_CONTENT_USER`: User prompt or input

### Interest to Segment Mapping
Required for `updateSegments` command.

- `INTEREST_SEGMENT_MAPPING`: A JSON string mapping interests to their corresponding segments, for example:

  ```json
  {"interest1":"segment1","interest2":"segment1","interest3":"segment2","interest4":"segment3"}
  ```