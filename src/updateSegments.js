import { Client } from '@elastic/elasticsearch';

// Elasticsearch client initialization
const client = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    username: process.env.ELASTIC_HTTP_AUTH_USERNAME,
    password: process.env.ELASTIC_HTTP_AUTH_PASSWORD,
  },
});

// Parse the interest-to-segment mapping from environment variable
const interestToSegmentMapping = JSON.parse(process.env.INTEREST_SEGMENT_MAPPING);

export async function updateInterestsToSegments() {
  try {
    console.log(interestToSegmentMapping);
    
    const result = await client.updateByQuery({
      index: process.env.ELASTIC_INDEX,
      body: {
        script: {
          source: `
            Map interestToSegment = params.mapping;
            boolean found = false;
            for (item in ctx._source.interests) {
              if (interestToSegment.containsKey(item)) {
                ctx._source.segment = interestToSegment.get(item);
                found = true;
                break;
              }
            }
            if (!found) {
              ctx._source.segment = "Unknown"; // Default value if no match is found
            }
          `,
          lang: 'painless',
          params: {
            mapping: interestToSegmentMapping,
          },
        },
        query: {
          exists: {
            field: "interests" // Ensure the script only runs on documents with an 'interests' field
          }
        },
      },
      refresh: true // Refresh index to make sure changes are visible
    });

    console.log('Interests updated to segments successfully:', result);
  } catch (error) {
    console.error('Error updating interests to segments:', error);
  }
}
