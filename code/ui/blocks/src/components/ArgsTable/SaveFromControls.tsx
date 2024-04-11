import {
  Bar as BaseBar,
  Button,
  Form,
  IconButton,
  Modal,
  SyntaxHighlighter,
  TooltipNote,
  WithTooltip,
} from '@storybook/components';
import { AddIcon, CheckIcon, EyeCloseIcon, EyeIcon, UndoIcon } from '@storybook/icons';
import { ThemeProvider, convert, keyframes, styled, themes, useTheme } from '@storybook/theming';
import React from 'react';
import objectInspect from 'object-inspect';
import utilInspect from 'object-inspect/util.inspect';
import type { Args } from './types';
import dedent from 'ts-dedent';

const slideIn = keyframes({
  from: { transform: 'translateY(40px)' },
  to: { transform: 'translateY(0)' },
});

const Container = styled.div({
  containerType: 'size',
  position: 'sticky',
  bottom: 0,
  height: 39,
  overflow: 'hidden',
});

const Bar = styled(BaseBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row-reverse', // hide Info rather than Actions on overflow
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 6,
  padding: '6px 10px',
  animation: `${slideIn} 300ms forwards`,
  background: theme.background.bar,
  borderTop: `1px solid ${theme.appBorderColor}`,
  fontSize: theme.typography.size.s2,
}));

const Info = styled.div({
  display: 'flex',
  flex: '99 0 auto',
  alignItems: 'center',
  marginLeft: 10,
  gap: 6,
});

const Actions = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 0 0',
  alignItems: 'center',
  gap: 2,
  color: theme.color.mediumdark,
  fontSize: theme.typography.size.s2,
}));

const Label = styled.div({
  '@container (max-width: 799px)': {
    lineHeight: 0,
    textIndent: '-9999px',
    '&::after': {
      content: 'attr(data-short-label)',
      display: 'block',
      lineHeight: 'initial',
      textIndent: '0',
    },
  },
});

const ModalInput = styled(Form.Input)(({ theme }) => ({
  '::placeholder': {
    color: theme.color.mediumdark,
  },
  '&:invalid:not(:placeholder-shown)': {
    boxShadow: `${theme.color.negative} 0 0 0 1px inset`,
  },
}));

const Preview = styled(SyntaxHighlighter)<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: '100%',
  opacity: collapsed ? 0 : 1,
  maxHeight: collapsed ? 0 : 300,
  margin: collapsed ? '-8px 0' : 0,
  overflow: collapsed ? 'hidden' : 'auto',
  transition: 'all 200ms ease-in-out',
  background: theme.background.app,
  borderRadius: theme.appBorderRadius,
  fontSize: `${theme.typography.size.s1}px`,
  lineHeight: '18px',
  'pre.prismjs': {
    padding: 10,
    background: 'inherit',
  },
}));

const getCode = ({
  args,
  fileName,
  storyName = 'StoryName',
}: {
  args: any;
  fileName: string;
  storyName?: string;
}) => {
  console.log({ objectInspect, utilInspect });
  const string = objectInspect(args, { indent: 2, inspect: false }).replace(
    /(\[Function: .+\]) {.+}/g,
    '$1'
  );
  const argsCode = dedent`  ${string}`;
  return dedent`
    // ${fileName}
    export const ${storyName?.trim() || 'StoryName'} = {
      args: ${argsCode.trim()},
      // other properties from the original
      // story will be copied over as well
    };
  `;
};

type SaveFromControlsProps = {
  args: Args;
  fileName: string;
  resetArgs: () => void;
  saveStory: () => void;
  createStory: (storyName: string) => void;
  showStoryPreview: boolean;
  toggleStoryPreview: () => void;
};

export const SaveFromControls = ({
  args,
  fileName,
  resetArgs,
  saveStory,
  createStory,
  showStoryPreview,
  toggleStoryPreview,
}: SaveFromControlsProps) => {
  const { typography } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [saving, setSaving] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [storyName, setStoryName] = React.useState('');

  const onSaveStory = () => {
    setSaving(true);
    saveStory();
    setTimeout(() => setSaving(false), 1000);
  };

  const onShowForm = () => {
    setCreating(true);
    setStoryName('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-z-_ ]/gi, '')
      .replaceAll(/([-_ ]+[a-z])/gi, (match) => match.toUpperCase().replace(/[-_ ]/g, ''));
    setStoryName(value.charAt(0).toUpperCase() + value.slice(1));
  };
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    createStory(storyName.replaceAll(/[^a-z]/gi, ''));
    setTimeout(() => {
      setSaving(false);
      setCreating(false);
    }, 1000);
  };

  return (
    <Container>
      <Bar>
        <Actions>
          <WithTooltip
            as="div"
            hasChrome={false}
            trigger="hover"
            tooltip={<TooltipNote note="Save changes to story" />}
          >
            <IconButton aria-label="Save changes to story" disabled={saving} onClick={onSaveStory}>
              <CheckIcon />
              <Label data-short-label="Save">Update story</Label>
            </IconButton>
          </WithTooltip>

          <WithTooltip
            as="div"
            hasChrome={false}
            trigger="hover"
            tooltip={<TooltipNote note="Create new story with these settings" />}
          >
            <IconButton aria-label="Create new story with these settings" onClick={onShowForm}>
              <AddIcon />
              <Label data-short-label="New">Create new story</Label>
            </IconButton>
          </WithTooltip>

          <WithTooltip
            as="div"
            hasChrome={false}
            trigger="hover"
            tooltip={<TooltipNote note="Reset changes" />}
          >
            <IconButton aria-label="Reset changes" onClick={() => resetArgs()}>
              <UndoIcon />
              <span>Reset</span>
            </IconButton>
          </WithTooltip>
        </Actions>

        <Info>
          <Label data-short-label="Unsaved changes">
            You modified this story. Do you want to save your changes?
          </Label>
        </Info>

        <Modal width={420} open={creating} onOpenChange={setCreating}>
          <Form onSubmit={onSubmitForm}>
            <Modal.Content>
              <Modal.Header>
                <Modal.Title>Create new story</Modal.Title>
                <Modal.Description>
                  This will add a new story to your existing stories file.
                </Modal.Description>
              </Modal.Header>
              <ModalInput
                onChange={onChange}
                placeholder="Story export name"
                readOnly={saving}
                ref={inputRef}
                value={storyName}
              />

              <ThemeProvider
                theme={convert({
                  ...themes.dark,
                  fontCode: typography.fonts.mono,
                  fontBase: typography.fonts.base,
                })}
              >
                <Preview collapsed={!showStoryPreview} language="typescript">
                  {getCode({ args, fileName, storyName })}
                </Preview>
              </ThemeProvider>

              <Modal.Row>
                <Button type="button" variant="ghost" onClick={toggleStoryPreview}>
                  {showStoryPreview ? (
                    <>
                      <EyeCloseIcon />
                      Hide preview
                    </>
                  ) : (
                    <>
                      <EyeIcon />
                      Show preview
                    </>
                  )}
                </Button>
                <Modal.Actions>
                  <Button
                    disabled={saving || !storyName}
                    size="medium"
                    type="submit"
                    variant="solid"
                  >
                    Create
                  </Button>
                  <Modal.Dialog.Close asChild>
                    <Button disabled={saving} size="medium" type="reset">
                      Cancel
                    </Button>
                  </Modal.Dialog.Close>
                </Modal.Actions>
              </Modal.Row>
            </Modal.Content>
          </Form>
        </Modal>
      </Bar>
    </Container>
  );
};
