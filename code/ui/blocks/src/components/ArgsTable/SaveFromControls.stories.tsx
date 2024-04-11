import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SaveFromControls } from './SaveFromControls';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';

const meta = {
  component: SaveFromControls,
  title: 'Components/ArgsTable/SaveFromControls',
  args: {
    args: {
      enabled: true,
      label: 'Hello',
      onChange: action('onChange'),
      complexObject: { foo: new Set() },
    },
    fileName: 'src/MyComponent.stories.tsx',
    resetArgs: fn(action('resetArgs')),
    saveStory: fn(action('saveStory')),
    createStory: fn(action('createStory')),
    showStoryPreview: false,
    toggleStoryPreview: fn(action('toggleStoryPreview')),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SaveFromControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Creating: Story = {
  play: async ({ canvasElement }) => {
    const createButton = await within(canvasElement).findByRole('button', { name: /Create/i });
    await fireEvent.click(createButton);
  },
};

export const Previewing: Story = {
  args: {
    showStoryPreview: true,
  },
  play: async (context) => {
    await Creating.play(context);

    await waitFor(async () => {
      const dialog = await within(document.body).findByRole('dialog');
      const input = await within(dialog).findByRole('textbox');
      await userEvent.type(input, 'MyNewStory');
    });
  },
};

export const Created: Story = {
  play: async (context) => {
    await Creating.play(context);

    await waitFor(async () => {
      const dialog = await within(document.body).findByRole('dialog');
      const input = await within(dialog).findByRole('textbox');
      await userEvent.type(input, 'MyNewStory');
      const submitButton = await within(dialog).findByRole('button', { name: /Create/i });
      await userEvent.click(submitButton);
    });

    await expect(context.args.createStory).toHaveBeenCalledWith('MyNewStory');
  },
};
