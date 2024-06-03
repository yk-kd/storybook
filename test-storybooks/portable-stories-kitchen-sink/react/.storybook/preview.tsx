import type { Preview } from '@storybook/react';
// import {withTests} from '@storybook/addon-jest'
// import results from '../.test-results.json'
console.log('preview file is called!');

const preview: Preview = {
  decorators: [
    (StoryFn) => (
      <div data-testid="global-decorator">
        Global Decorator
        <br />
        {StoryFn()}
      </div>
    ),
    // withTests({
    //   results,
    //   filesExt:'((\\.stories?)|(\\.tests?))?(\\.[jt]sx?)?$'
    // })
  ],
  globalTypes: {
    locale: {
      description: 'Locale for components',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'circlehollow',
        items: ['es', 'en'],
      },
    },
  },
};

export default preview;
