import type { ApiMutedAccountJSON } from '@/flavours/glitch/api_types/accounts';
import type { Account } from '@/flavours/glitch/models/account';
import { isServerFeatureEnabled } from '@/flavours/glitch/utils/environment';

export function areCollectionsEnabled() {
  return isServerFeatureEnabled('collections');
}

export const getCollectionPath = (id: string) => `/collections/${id}`;

export const canAccountBeAdded = (account: ApiMutedAccountJSON | Account) =>
  ['automatic', 'manual'].includes(account.feature_approval.current_user);

export const canAccountBeAddedByFollowers = (
  account: ApiMutedAccountJSON | Account,
) =>
  account.feature_approval.automatic.includes('followers') ||
  account.feature_approval.manual.includes('followers');
