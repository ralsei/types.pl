import { useCallback, useMemo } from 'react';
import type { FC } from 'react';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { openModal } from '@/flavours/glitch/actions/modal';
import { AccountFields } from '@/flavours/glitch/components/account_fields';
import { EmojiHTML } from '@/flavours/glitch/components/emoji/html';
import { FormattedDateWrapper } from '@/flavours/glitch/components/formatted_date';
import { Icon } from '@/flavours/glitch/components/icon';
import { MiniCardList } from '@/flavours/glitch/components/mini_card/list';
import { useElementHandledLink } from '@/flavours/glitch/components/status/handled_link';
import { useAccount } from '@/flavours/glitch/hooks/useAccount';
import type { Account } from '@/flavours/glitch/models/account';
import { useAppDispatch } from '@/flavours/glitch/store';
import IconVerified from '@/images/icons/icon_verified.svg?react';

import { isRedesignEnabled } from '../common';

import classes from './redesign.module.scss';

export const AccountHeaderFields: FC<{ accountId: string }> = ({
  accountId,
}) => {
  const account = useAccount(accountId);

  if (!account) {
    return null;
  }

  if (isRedesignEnabled()) {
    return <RedesignAccountHeaderFields account={account} />;
  }

  return (
    <div className='account__header__fields'>
      <dl>
        <dt>
          <FormattedMessage id='account.joined_short' defaultMessage='Joined' />
        </dt>
        <dd>
          <FormattedDateWrapper
            value={account.created_at}
            year='numeric'
            month='short'
            day='2-digit'
          />
        </dd>
      </dl>

      <AccountFields fields={account.fields} emojis={account.emojis} />
    </div>
  );
};

const RedesignAccountHeaderFields: FC<{ account: Account }> = ({ account }) => {
  const htmlHandlers = useElementHandledLink();
  const cards = useMemo(
    () =>
      account.fields
        .toArray()
        .map(({ value_emojified, name_emojified, verified_at }) => ({
          label: (
            <>
              <EmojiHTML
                htmlString={name_emojified}
                extraEmojis={account.emojis}
                className='translate'
                as='span'
                {...htmlHandlers}
              />
              {!!verified_at && (
                <Icon
                  id='verified'
                  icon={IconVerified}
                  className={classes.fieldIconVerified}
                />
              )}
            </>
          ),
          value: (
            <EmojiHTML
              as='span'
              htmlString={value_emojified}
              extraEmojis={account.emojis}
              {...htmlHandlers}
            />
          ),
          className: classNames(
            classes.fieldCard,
            !!verified_at && classes.fieldCardVerified,
          ),
        })),
    [account.emojis, account.fields, htmlHandlers],
  );

  const dispatch = useAppDispatch();
  const handleOverflowClick = useCallback(() => {
    dispatch(
      openModal({
        modalType: 'ACCOUNT_FIELDS',
        modalProps: { accountId: account.id },
      }),
    );
  }, [account.id, dispatch]);

  return (
    <MiniCardList
      cards={cards}
      className={classes.fieldList}
      onOverflowClick={handleOverflowClick}
    />
  );
};
