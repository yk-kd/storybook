import * as React from 'react';
import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY, REPORT_STATE_ID } from './shared';

import Panel from './components/Panel';
import { SharedState } from './utils/SharedState';
import type { API_StatusUpdate, API_StatusValue, StoryId } from '@storybook/types';
import type { TestReport } from './types';

const assertionResultToStatus = {
  pending: 'pending',
  passed: 'success',
  failed: 'error',
} as const;

export function reportToStatusUpdate(report: TestReport): API_StatusUpdate {
  const storyIdToStatus: Record<StoryId, API_StatusValue | null> = {};

  report.testResults.forEach((testResult) => {
    testResult.assertionResults.forEach(({ status }) => {
      const storyId = 'example-button--csf-3-input-field-filled';
      storyIdToStatus[storyId] = assertionResultToStatus[status];
    });
  });

  const update = Object.fromEntries(
    Object.entries(storyIdToStatus).map(([storyId, status]) => [
      storyId,
      status && {
        status,
        title: 'Unit Tests',
        description: `Ran ${new Date(report.startTime).toLocaleTimeString()}`,
      },
    ])
  );

  return update;
}

// Overall idea:
// - Run tests in watch mode, generating a report file ✅
// - Addon reads the report file in watch mode ✅
// - Addon shows status in sidebar
// - Addon shows filter button in sidebar bottom
// - (nice to have) Somehow trigger the tests run if they are not running already (probably the sidebar top button)

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: 'Tests',
    type: types.PANEL,
    render: ({ active }) => <Panel api={api} active={active} />,
    paramKey: PARAM_KEY,
  });

  const channel = api.getChannel();
  if (!channel) return;

  const testReportState = SharedState.subscribe<any>(REPORT_STATE_ID, channel);

  testReportState.on('change', async (report) => {
    console.log(report);

    // TODO: Temporary workaround to reuse VTA's sidebar filter button
    api.experimental_updateStatus('chromaui/addon-visual-tests', (state) => ({
      ...Object.fromEntries(
        Object.entries(state)
          .map(([storyId, status]) => [storyId, status['chromaui/addon-visual-tests']])
          .filter(([, status]) => status)
      ),
      ...reportToStatusUpdate(report),
    }));
  });
});
