import { watch } from 'node:fs';
import { join } from 'path';
import type { TestReport } from './types';
import { readFile } from 'node:fs/promises';

import type { Channel } from '@storybook/channels';
import type { Options } from '@storybook/types';

import { SharedState } from './utils/SharedState';
import { REPORT_STATE_ID } from './shared';

async function getTestReport(reportFile: string): Promise<TestReport | null> {
  try {
    const data = await readFile(reportFile, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    console.error('Failed to parse test results', error);
    throw error;
  }
}

const watchTestReport = async (
  reportFile: string | undefined,
  onChange: (results: Awaited<ReturnType<typeof getTestReport>>) => Promise<void>
) => {
  if (!reportFile) return;
  const results = await getTestReport(reportFile);
  await onChange(results);

  // watch(process.cwd(), async (eventType: string, filename: string | null) => {
  //   console.log('File changed', { eventType, filename, reportFile });
  //   if (filename === reportFile) await onChange(await getTestReport(filename));
  // });
  watch(reportFile, async (eventType: string, filename: string | null) => {
    console.log('File changed', { eventType, filename, reportFile });
    if (filename) await onChange(await getTestReport(filename));
  });
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function experimental_serverChannel(
  channel: Channel,
  options: Options & { reportFile?: string }
) {
  const { reportFile = join(process.cwd(), '.test-results.json') } = options;

  const testReportState = SharedState.subscribe<TestReport | null>(REPORT_STATE_ID, channel);
  testReportState.value = await getTestReport(reportFile);

  watchTestReport(reportFile, async (results) => {
    testReportState.value = results;
  });
}
