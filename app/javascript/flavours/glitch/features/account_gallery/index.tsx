import { useEffect, useCallback } from 'react';

import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

import { useParams } from 'react-router-dom';

import { createSelector } from '@reduxjs/toolkit';
import type { Map as ImmutableMap } from 'immutable';
import { List as ImmutableList } from 'immutable';

import PersonIcon from '@/material-icons/400-24px/person.svg?react';
import { lookupAccount, fetchAccount } from 'flavours/glitch/actions/accounts';
import { openModal } from 'flavours/glitch/actions/modal';
import { expandAccountMediaTimeline } from 'flavours/glitch/actions/timelines';
import ScrollableList from 'flavours/glitch/components/scrollable_list';
import { TimelineHint } from 'flavours/glitch/components/timeline_hint';
import { AccountHeader } from 'flavours/glitch/features/account_timeline/components/account_header';
import { LimitedAccountHint } from 'flavours/glitch/features/account_timeline/components/limited_account_hint';
import BundleColumnError from 'flavours/glitch/features/ui/components/bundle_column_error';
import Column from 'flavours/glitch/features/ui/components/column';
import type { MediaAttachment } from 'flavours/glitch/models/media_attachment';
import { normalizeForLookup } from 'flavours/glitch/reducers/accounts_map';
import { getAccountHidden } from 'flavours/glitch/selectors/accounts';
import type { RootState } from 'flavours/glitch/store';
import { useAppSelector, useAppDispatch } from 'flavours/glitch/store';

import { MediaItem } from './components/media_item';

const messages = defineMessages({
  profile: { id: 'column_header.profile', defaultMessage: 'Profile' },
});

const getAccountGallery = createSelector(
  [
    (state: RootState, accountId: string) =>
      (state.timelines as ImmutableMap<string, unknown>).getIn(
        [`account:${accountId}:media`, 'items'],
        ImmutableList(),
      ) as ImmutableList<string>,
    (state: RootState) => state.statuses,
  ],
  (statusIds, statuses) => {
    let items = ImmutableList<MediaAttachment>();

    statusIds.forEach((statusId) => {
      const status = statuses.get(statusId) as
        | ImmutableMap<string, unknown>
        | undefined;

      if (status) {
        items = items.concat(
          (
            status.get('media_attachments') as ImmutableList<MediaAttachment>
          ).map((media) => media.set('status', status)),
        );
      }
    });

    return items;
  },
);

interface Params {
  acct?: string;
  id?: string;
}

const RemoteHint: React.FC<{
  accountId: string;
}> = ({ accountId }) => {
  const account = useAppSelector((state) => state.accounts.get(accountId));
  const acct = account?.acct;
  const url = account?.url;
  const domain = acct ? acct.split('@')[1] : undefined;

  if (!url) {
    return null;
  }

  return (
    <TimelineHint
      url={url}
      message={
        <FormattedMessage
          id='hints.profiles.posts_may_be_missing'
          defaultMessage='Some posts from this profile may be missing.'
        />
      }
      label={
        <FormattedMessage
          id='hints.profiles.see_more_posts'
          defaultMessage='See more posts on {domain}'
          values={{ domain: <strong>{domain}</strong> }}
        />
      }
    />
  );
};

export const AccountGallery: React.FC<{
  multiColumn: boolean;
}> = ({ multiColumn }) => {
  const intl = useIntl();
  const { acct, id } = useParams<Params>();
  const dispatch = useAppDispatch();
  const accountId = useAppSelector(
    (state) =>
      id ??
      (state.accounts_map.get(normalizeForLookup(acct)) as string | undefined),
  );
  const attachments = useAppSelector((state) =>
    accountId
      ? getAccountGallery(state, accountId)
      : ImmutableList<MediaAttachment>(),
  );
  const isLoading = useAppSelector((state) =>
    (state.timelines as ImmutableMap<string, unknown>).getIn([
      `account:${accountId}:media`,
      'isLoading',
    ]),
  );
  const hasMore = useAppSelector((state) =>
    (state.timelines as ImmutableMap<string, unknown>).getIn([
      `account:${accountId}:media`,
      'hasMore',
    ]),
  );
  const account = useAppSelector((state) =>
    accountId ? state.accounts.get(accountId) : undefined,
  );
  const blockedBy = useAppSelector(
    (state) =>
      state.relationships.getIn([accountId, 'blocked_by'], false) as boolean,
  );
  const suspended = useAppSelector(
    (state) => state.accounts.getIn([accountId, 'suspended'], false) as boolean,
  );
  const isAccount = !!account;
  const remote = account?.acct !== account?.username;
  const hidden = useAppSelector((state) =>
    accountId ? getAccountHidden(state, accountId) : false,
  );
  const maxId = attachments.last()?.getIn(['status', 'id']) as
    | string
    | undefined;

  useEffect(() => {
    if (!accountId) {
      dispatch(lookupAccount(acct));
    }
  }, [dispatch, accountId, acct]);

  useEffect(() => {
    if (accountId && !isAccount) {
      dispatch(fetchAccount(accountId));
    }

    if (accountId && isAccount) {
      void dispatch(expandAccountMediaTimeline(accountId));
    }
  }, [dispatch, accountId, isAccount]);

  const handleLoadMore = useCallback(() => {
    if (maxId) {
      void dispatch(expandAccountMediaTimeline(accountId, { maxId }));
    }
  }, [dispatch, accountId, maxId]);

  const handleOpenMedia = useCallback(
    (attachment: MediaAttachment) => {
      const statusId = attachment.getIn(['status', 'id']);
      const lang = attachment.getIn(['status', 'language']);

      if (attachment.get('type') === 'video') {
        dispatch(
          openModal({
            modalType: 'VIDEO',
            modalProps: {
              media: attachment,
              statusId,
              lang,
              options: { autoPlay: true },
            },
          }),
        );
      } else if (attachment.get('type') === 'audio') {
        dispatch(
          openModal({
            modalType: 'AUDIO',
            modalProps: {
              media: attachment,
              statusId,
              lang,
              options: { autoPlay: true },
            },
          }),
        );
      } else {
        const media = attachment.getIn([
          'status',
          'media_attachments',
        ]) as ImmutableList<MediaAttachment>;
        const index = media.findIndex(
          (x) => x.get('id') === attachment.get('id'),
        );

        dispatch(
          openModal({
            modalType: 'MEDIA',
            modalProps: { media, index, statusId, lang },
          }),
        );
      }
    },
    [dispatch],
  );

  if (accountId && !isAccount) {
    return <BundleColumnError multiColumn={multiColumn} errorType='routing' />;
  }

  let emptyMessage;

  if (accountId) {
    if (suspended) {
      emptyMessage = (
        <FormattedMessage
          id='empty_column.account_suspended'
          defaultMessage='Account suspended'
        />
      );
    } else if (hidden) {
      emptyMessage = <LimitedAccountHint accountId={accountId} />;
    } else if (blockedBy) {
      emptyMessage = (
        <FormattedMessage
          id='empty_column.account_unavailable'
          defaultMessage='Profile unavailable'
        />
      );
    } else if (remote && attachments.isEmpty()) {
      emptyMessage = <RemoteHint accountId={accountId} />;
    } else {
      emptyMessage = (
        <FormattedMessage
          id='empty_column.account_timeline'
          defaultMessage='No posts found'
        />
      );
    }
  }

  const forceEmptyState = suspended || blockedBy || hidden;

  return (
    <Column
      icon='user-circle'
      iconComponent={PersonIcon}
      heading={intl.formatMessage(messages.profile)}
      alwaysShowBackButton
    >
      <ScrollableList
        className='account-gallery__container'
        prepend={
          accountId && (
            <AccountHeader accountId={accountId} hideTabs={forceEmptyState} />
          )
        }
        alwaysPrepend
        append={remote && accountId && <RemoteHint accountId={accountId} />}
        scrollKey='account_gallery'
        isLoading={isLoading}
        hasMore={!forceEmptyState && hasMore}
        onLoadMore={handleLoadMore}
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
      >
        {attachments.map((attachment) => (
          <MediaItem
            key={attachment.get('id') as string}
            attachment={attachment}
            onOpenMedia={handleOpenMedia}
          />
        ))}
      </ScrollableList>
    </Column>
  );
};

// eslint-disable-next-line import/no-default-export
export default AccountGallery;
