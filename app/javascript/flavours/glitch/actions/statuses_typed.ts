import { apiGetContext } from 'flavours/glitch/api/statuses';
import { createDataLoadingThunk } from 'flavours/glitch/store/typed_functions';

import { importFetchedStatuses } from './importer';

export const fetchContext = createDataLoadingThunk(
  'status/context',
  ({ statusId }: { statusId: string }) => apiGetContext(statusId),
  (context, { dispatch }) => {
    const statuses = context.ancestors.concat(context.descendants);

    dispatch(importFetchedStatuses(statuses));

    return {
      context,
    };
  },
);
