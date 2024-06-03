import * as React from 'react';
import type { API } from '@storybook/manager-api';
import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY, REPORT_STATE_ID } from './shared';

import Panel from './components/Panel';
import { SharedState } from './utils/SharedState';
import type { API_StatusUpdate, API_StatusValue, StoryId } from '@storybook/types';
import type { TestReport } from './types';

// This is supposed to be ADDON_ID instead
const SUPPOSED_TO_BE_ADDON_ID = 'chromaui/addon-visual-tests';

const assertionResultToStatus = {
  pending: 'pending',
  passed: 'success',
  failed: 'error',
} as const;

export function reportToStatusUpdate(report: TestReport, api: API): API_StatusUpdate {
  const storyIdToStatus: Record<StoryId, API_StatusValue | null> = {};

  report.testResults.forEach((testResult) => {
    testResult.assertionResults.forEach(({ status, fullName }) => {
      const storyId = fullName.match(/\[([^\]]+)\]/)?.[1] || '';
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
        onClick: () => {
          api.setSelectedPanel('storybook/interactions/panel');
          // api.setSelectedPanel(PANEL_ID);
          api.selectStory(storyId);
        },
      },
    ])
  );

  return update;
}

// Overall idea:
// - Run tests in watch mode, generating a report file ✅
// - Addon reads the report file in watch mode ✅
// - Addon shows status in sidebar ✅
// - Addon shows filter button in sidebar bottom ✅ (via VTA)
// - (nice to have) Somehow trigger the tests run if they are not running already (probably the sidebar top button)

addons.register(ADDON_ID, async (api) => {
  addons.add(PANEL_ID, {
    title: 'Tests',
    type: types.PANEL,
    render: ({ active }) => <Panel api={api} active={active} />,
    paramKey: PARAM_KEY,
  });

  const channel = api.getChannel();
  if (!channel) return;

  const onReportStateChange = async (report?: TestReport) => {
    if (!report) return;

    // TODO: Temporary workaround to reuse VTA's sidebar filter button
    api.experimental_updateStatus(SUPPOSED_TO_BE_ADDON_ID, (state) => ({
      ...Object.fromEntries(
        Object.entries(state)
          .map(([storyId, status]) => [storyId, status[SUPPOSED_TO_BE_ADDON_ID]])
          .filter(([, status]) => status)
      ),
      ...reportToStatusUpdate(report, api),
    }));
  };

  const testReportState = SharedState.subscribe<TestReport>(REPORT_STATE_ID, channel);
  testReportState.on('change', onReportStateChange);

  await onReportStateChange(testReportState.value);
});
