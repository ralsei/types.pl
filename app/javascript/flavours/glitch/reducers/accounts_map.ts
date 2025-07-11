import { createReducer } from '@reduxjs/toolkit';
import type { UnknownAction } from '@reduxjs/toolkit';

import type { AxiosError } from 'axios';

import { ACCOUNT_LOOKUP_FAIL } from 'flavours/glitch/actions/accounts';
import { importAccounts } from 'flavours/glitch/actions/importer/accounts';
import { domain } from 'flavours/glitch/initial_state';

interface AccountLookupFailAction extends UnknownAction {
  acct: string;
  error?: AxiosError;
}

const pattern = new RegExp(`@${domain}$`, 'gi');

export const normalizeForLookup = (str: string) =>
  str.toLowerCase().replace(pattern, '');

const initialState: Record<string, string | null> = {};

export const accountsMapReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(importAccounts, (state, action) => {
      action.payload.accounts.forEach((account) => {
        state[normalizeForLookup(account.acct)] = account.id;
      });
    })
    .addMatcher(
      (action: UnknownAction): action is AccountLookupFailAction =>
        action.type === ACCOUNT_LOOKUP_FAIL,
      (state, action) => {
        if (action.error?.response?.status === 404) {
          state[normalizeForLookup(action.acct)] = null;
        }
      },
    );
});
