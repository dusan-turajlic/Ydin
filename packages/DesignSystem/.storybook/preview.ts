import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import '@/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    backgrounds: {
      options: {
        dark: { name: 'dark', value: '#201b12' },
        light: { name: 'light', value: '#ffffff' }
      }
    },
  },

  decorators: [
    (Story) => createElement('div', { className: 'dark' }, createElement(Story)),
  ],

  initialGlobals: {
    backgrounds: {
      value: 'dark'
    }
  }
};

export default preview;

