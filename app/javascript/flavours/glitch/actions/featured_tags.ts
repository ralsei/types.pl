import { apiGetFeaturedTags } from 'flavours/glitch/api/accounts';
import { createDataLoadingThunk } from 'flavours/glitch/store/typed_functions';

export const fetchFeaturedTags = createDataLoadingThunk(
  'accounts/featured_tags',
  ({ accountId }: { accountId: string }) => apiGetFeaturedTags(accountId),
);
