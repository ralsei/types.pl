import { lazy, Suspense } from 'react';

import { LoadingIndicator } from '@/flavours/glitch/components/loading_indicator';
import { isRedesignEnabled } from '@/flavours/glitch/utils/environment';

const LazyStatusRedesign = lazy(() =>
  import('./redesign').then(({ StatusPage }) => ({ default: StatusPage })),
);
const LazyStatusLegacy = lazy(() => import('./legacy'));

const StatusPage = (props: Record<string, unknown>) => (
  <Suspense fallback={<LoadingIndicator />}>
    {isRedesignEnabled() ? (
      <LazyStatusRedesign />
    ) : (
      <LazyStatusLegacy {...props} />
    )}
  </Suspense>
);

// eslint-disable-next-line import/no-default-export
export default StatusPage;
