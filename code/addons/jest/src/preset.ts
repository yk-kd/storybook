import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';

import type { Channel } from '@storybook/channels';
import type { Options } from '@storybook/types';

import { SharedState } from './utils/SharedState';

type TestResults = {};

async function getTestResults(reportFile: string): Promise<TestResults> {
  try {
    const data = await readFile(reportFile, 'utf8');
    return JSON.parse(data); // TODO: Streaming and parsing large files
  } catch (e) {
    console.error('Failed to parse test results', e);
    return {};
  }
}

const watchTestResults = async (
  reportFile: string | undefined,
  onChange: (results: Awaited<ReturnType<typeof getTestResults>>) => Promise<void>
) => {
  if (!reportFile) return;
  const results = await getTestResults(reportFile);
  await onChange(results);

  watch(reportFile, async (eventType: string, filename: string | null) => {
    if (filename) await onChange(await getTestResults(filename));
  });
};

function managerEntries(entry: string[] = []) {
  return [...entry, require.resolve('./manager.mjs')];
}

async function serverChannel(channel: Channel, options: Options & { reportFile?: string }) {
  const { reportFile = 'MOCK_RESULTS.json' } = options;

  const testResultsState = SharedState.subscribe<TestResults>('TEST_RESULTS', channel);
  testResultsState.value = await getTestResults(reportFile);

  watchTestResults(reportFile, async (results) => {
    testResultsState.value = results;
  });
}

const config = {
  managerEntries,
  experimental_serverChannel: serverChannel,
};

export default config;
