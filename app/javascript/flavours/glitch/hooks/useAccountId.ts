import { useEffect } from 'react';

import { useParams } from 'react-router';

import { fetchAccount, lookupAccount } from 'flavours/glitch/actions/accounts';
import { normalizeForLookup } from 'flavours/glitch/reducers/accounts_map';
import { useAppDispatch, useAppSelector } from 'flavours/glitch/store';

interface Params {
  acct?: string;
  id?: string;
}

export const useAccountId = () => {
  const { acct, id } = useParams<Params>();
  const dispatch = useAppDispatch();
  const accountId = useAppSelector(
    (state) =>
      id ?? (acct ? state.accounts_map[normalizeForLookup(acct)] : undefined),
  );
  const account = useAppSelector((state) =>
    accountId ? state.accounts.get(accountId) : undefined,
  );
  const accountInStore = !!account;

  useEffect(() => {
    if (typeof accountId === 'undefined' && acct) {
      dispatch(lookupAccount(acct));
    } else if (accountId && !accountInStore) {
      dispatch(fetchAccount(accountId));
    }
  }, [dispatch, accountId, acct, accountInStore]);

  return accountId;
};
