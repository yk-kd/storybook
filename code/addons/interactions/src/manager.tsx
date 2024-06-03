import React, { useCallback } from 'react';
import { addons, Consumer, types, useAddonState } from '@storybook/manager-api';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { CallStates } from '@storybook/instrumenter';
import { ADDON_ID, PANEL_ID } from './constants';
import { Panel } from './Panel';
import { TabIcon } from './components/TabStatus';
import type { Combo } from '@storybook/manager-api';
import type { API_StatusUpdate } from '@storybook/types';

function Title() {
  const [addonState = {}] = useAddonState(ADDON_ID);
  const { hasException, interactionsCount } = addonState as any;

  return (
    <div>
      <Spaced col={1}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Interactions</span>
        {interactionsCount && !hasException ? (
          <Badge status="neutral">{interactionsCount}</Badge>
        ) : null}
        {hasException ? <TabIcon status={CallStates.ERROR} /> : null}
      </Spaced>
    </div>
  );
}

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: Title,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => {
      const newLocal = useCallback(({ state }: Combo) => {
        return {
          storyId: state.storyId,
        };
      }, []);

      return (
        <AddonPanel active={active}>
          <Consumer filter={newLocal}>{({ storyId }) => <Panel storyId={storyId} />}</Consumer>
        </AddonPanel>
      );
    },
  });

  const channel = api.getChannel();
  if (!channel) return;

  const onReportStateChange = async ({ data, id }: { data: API_StatusUpdate; id: string }) => {
    if (!data || id !== 'storybook-vitest-plugin') return;

    const statusData = Object.entries(data).reduce((acc, [storyId, value]) => {
      return {
        ...acc,
        [storyId]: {
          ...value,
          onClick: () => {
            api.setSelectedPanel(PANEL_ID);
            api.selectStory(storyId);
          },
        },
      };
    }, {} as API_StatusUpdate);

    // TODO: Temporary workaround to reuse VTA's sidebar filter button
    api.experimental_updateStatus(id, statusData);
  };

  channel.on('experimental-status-api', onReportStateChange);
});
