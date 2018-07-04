import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

function loadStories() {
  require('./index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
