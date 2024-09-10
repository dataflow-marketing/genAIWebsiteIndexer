import { Client } from '@elastic/elasticsearch';

// Elasticsearch client initialization
const client = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    username: process.env.ELASTIC_HTTP_AUTH_USERNAME,
    password: process.env.ELASTIC_HTTP_AUTH_PASSWORD,
  },
});

export async function listUniqueInterests() {
    try {
      const result = await client.search({
        index: process.env.ELASTIC_INDEX,
        body: {
          size: 0,
          aggs: {
            unique_interests: {
              terms: {
                field: "interests.keyword",
                size: 1000 // Adjust size if you need more results
              }
            }
          }
        }
      });
  
      const interests = result.aggregations.unique_interests.buckets;
      console.log('Unique interests:');
      console.dir(interests, {'maxArrayLength': null});
    } catch (error) {
      console.error('Error listing unique interests:', error);
    }
  }