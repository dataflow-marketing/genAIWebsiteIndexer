import { Client } from '@elastic/elasticsearch';

// Elasticsearch client initialization
const client = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    username: process.env.ELASTIC_HTTP_AUTH_USERNAME,
    password: process.env.ELASTIC_HTTP_AUTH_PASSWORD,
  },
});

export async function listUniqueSegments() {
    try {
      const result = await client.search({
        index: process.env.ELASTIC_INDEX,
        body: {
          size: 0,
          aggs: {
            unique_segments: {
              terms: {
                field: "segment.keyword",
                size: 1000 // Adjust size if you need more results
              }
            }
          }
        }
      });
  
      const segments = result.aggregations.unique_segments.buckets;
      console.log('Unique segments:');
      console.dir(segments, {'maxArrayLength': null});
    } catch (error) {
      console.error('Error listing unique segments:', error);
    }
  }