import { dequal as deepEqual } from 'dequal';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
  useAddonState,
} from '@storybook/manager-api';
import { PureArgsTable as ArgsTable, type PresetColor, type SortType } from '@storybook/blocks';

import type { ArgTypes } from '@storybook/types';
import { ADDON_ID, PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
}

export const ControlsPanel: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [args, updateArgs, resetArgs, initialArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path, previewInitialized } = useStorybookState();
  const storyFilePath = useParameter('fileName', '');
  const [fileName] = storyFilePath.toString().split('/').slice(-1);
  const [{ showStoryPreview }, updateState] = useAddonState(ADDON_ID, { showStoryPreview: false });

  const toggleStoryPreview = useCallback(
    () => updateState((state) => ({ ...state, showStoryPreview: !state.showStoryPreview })),
    [updateState]
  );

  // If the story is prepared, then show the args table
  // and reset the loading states
  useEffect(() => {
    if (previewInitialized) setIsLoading(false);
  }, [previewInitialized]);

  const hasControls = Object.values(rows).some((arg) => arg?.control);

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    if (arg?.control?.type !== 'color' || arg?.control?.presetColors) acc[key] = arg;
    else acc[key] = { ...arg, control: { ...arg.control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  const hasUpdatedArgs = useMemo(() => !deepEqual(args, initialArgs), [args, initialArgs]);

  return (
    <ArgsTable
      key={path} // resets state when switching stories
      compact={!expanded && hasControls}
      rows={withPresetColors}
      args={args}
      globals={globals}
      fileName={fileName}
      hasUpdatedArgs={hasUpdatedArgs}
      updateArgs={updateArgs}
      resetArgs={resetArgs}
      showStoryPreview={showStoryPreview}
      toggleStoryPreview={toggleStoryPreview}
      inAddonPanel
      sort={sort}
      isLoading={isLoading}
    />
  );
};
