import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import { fetchServer } from '@/flavours/glitch/actions/server';
import { hydrateStore } from '@/flavours/glitch/actions/store';
import { Router } from '@/flavours/glitch/components/router';
import { initializeEmoji } from '@/flavours/glitch/features/emoji';
import { Compose } from '@/flavours/glitch/features/standalone/compose';
import { initialState } from '@/flavours/glitch/initial_state';
import { IntlProvider } from '@/flavours/glitch/locales';
import { loadPolyfills } from '@/flavours/glitch/polyfills';
import ready from '@/flavours/glitch/ready';
import { store } from '@/flavours/glitch/store';

async function loaded() {
  const mountNode = document.getElementById('mastodon-compose');

  if (!mountNode) {
    return;
  }

  if (initialState) {
    store.dispatch(hydrateStore(initialState));
  }

  await store.dispatch(fetchServer());
  await initializeEmoji();

  const root = createRoot(mountNode);

  root.render(
    <IntlProvider>
      <Provider store={store}>
        <Router>
          <Compose />
        </Router>
      </Provider>
    </IntlProvider>,
  );
}

function main() {
  ready(loaded).catch((error: unknown) => {
    console.error(error);
  });
}

loadPolyfills()
  .then(main)
  .catch((error: unknown) => {
    console.error(error);
  });
