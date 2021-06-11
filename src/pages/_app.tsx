import 'css/global.css';
import { MDXProvider } from '@mdx-js/react';
import { useCMS } from '@tinacms/react-core';

import { MDXComponents, Meta } from 'components';
import { ToastProvider } from 'react-toast-notifications';
import {
  StrapiMediaStore,
  StrapiProvider,
  StrapiClient,
} from 'react-tinacms-strapi';
import { TinaCMS, TinaProvider } from 'tinacms';

import { useMemo } from 'react';
import { STRAPI_BASE_URL } from 'strapi-service';

export const EditButton = () => {
  const cms = useCMS();
  return (
    <button
      className="btn"
      onClick={() => (cms.enabled ? cms.disable() : cms.enable())}
    >
      {cms.enabled ? `Stop Editing ` : `Edit this Site `}
    </button>
  );
};

function App({ Component, pageProps }) {
  const cms = useMemo(
    () =>
      new TinaCMS({
        enabled: pageProps.preview,
        toolbar: pageProps.preview,
        apis: {
          strapi: new StrapiClient(STRAPI_BASE_URL),
        },
        media: new StrapiMediaStore(STRAPI_BASE_URL),
      }),
    []
  );

  const enterEditMode = () => {
    return fetch(`/api/preview`).then(() => {
      window.location.href = window.location.pathname;
    });
  };

  const exitEditMode = () => {
    return fetch(`/api/reset-preview`).then(() => {
      window.location.reload();
    });
  };

  return (
    <TinaProvider cms={cms}>
      <StrapiProvider onLogin={enterEditMode} onLogout={exitEditMode}>
        <ToastProvider autoDismiss placement="bottom-center">
          <Meta />
          <MDXProvider components={MDXComponents}>
            <EditButton />
            <Component {...pageProps} />
          </MDXProvider>
        </ToastProvider>
      </StrapiProvider>
    </TinaProvider>
  );
}

export default App;
