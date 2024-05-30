import * as React from 'react';
import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './shared';

import Panel from './components/Panel';
import { SharedState } from './utils/SharedState';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: 'Tests',
    type: types.PANEL,
    render: ({ active }) => <Panel api={api} active={active} />,
    paramKey: PARAM_KEY,
  });

  addons.add('SIDEBAR_BOTTOM_ID', {
    type: types.experimental_SIDEBAR_BOTTOM,
    render: ({ active }) => {
      return <div>Test filter</div>;
    },
  });

  const channel = api.getChannel();
  if (!channel) return;

  const testResultsState = SharedState.subscribe<any>('TEST_RESULTS', channel);

  testResultsState.on('change', async (results) => {
    console.log(results);
  });
});
