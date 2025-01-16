import { apiCreate, apiUpdate } from 'flavours/glitch/api/lists';
import type { List } from 'flavours/glitch/models/list';
import { createDataLoadingThunk } from 'flavours/glitch/store/typed_functions';

export const createList = createDataLoadingThunk(
  'list/create',
  (list: Partial<List>) => apiCreate(list),
);

export const updateList = createDataLoadingThunk(
  'list/update',
  (list: Partial<List>) => apiUpdate(list),
);
