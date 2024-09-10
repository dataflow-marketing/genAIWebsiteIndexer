import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { runCrawler } from './src/crawler.js';
import { listUniqueInterests } from './src/listUniqueInterests.js';
import { updateInterestsToSegments } from './src/updateSegments.js';
import { listUniqueSegments } from './src/listUniqueSegments.js';

// Command-line argument parsing
yargs(hideBin(process.argv))
  .command(
    'crawl',
    'Run the sitemap crawler and index content to Elasticsearch',
    () => {},
    async () => {
      await runCrawler();
    }
  )
  .command(
    'listUniqueInterests',
    'List unique interests in Elasticsearch',
    () => {},
    async () => {
      await listUniqueInterests();
    }
  )
  .command(
    'updateSegments',
    'Update interests to segments in Elasticsearch',
    () => {},
    async () => {
      await updateInterestsToSegments();
    }
  )
  .command(
    'listUniqueSegments',
    'List unique segments in Elasticsearch',
    () => {},
    async () => {
      await listUniqueSegments();
    }
  )
  .demandCommand(1, 'You need to specify a command to run (either "crawl" or "update-segments")')
  .help()
  .argv;
