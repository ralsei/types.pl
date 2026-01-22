import type { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { DisplayName } from '@/flavours/glitch/components/display_name';
import { AnimateEmojiProvider } from '@/flavours/glitch/components/emoji/context';
import { EmojiHTML } from '@/flavours/glitch/components/emoji/html';
import { Icon } from '@/flavours/glitch/components/icon';
import { IconButton } from '@/flavours/glitch/components/icon_button';
import { LoadingIndicator } from '@/flavours/glitch/components/loading_indicator';
import { useElementHandledLink } from '@/flavours/glitch/components/status/handled_link';
import { useAccount } from '@/flavours/glitch/hooks/useAccount';
import IconVerified from '@/images/icons/icon_verified.svg?react';
import CloseIcon from '@/material-icons/400-24px/close.svg?react';

import classes from './redesign.module.scss';

export const AccountFieldsModal: FC<{
  accountId: string;
  onClose: () => void;
}> = ({ accountId, onClose }) => {
  const intl = useIntl();
  const account = useAccount(accountId);
  const htmlHandlers = useElementHandledLink();

  if (!account) {
    return (
      <div className='modal-root__modal dialog-modal'>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className='modal-root__modal dialog-modal'>
      <div className='dialog-modal__header'>
        <IconButton
          icon='close'
          className={classes.modalCloseButton}
          onClick={onClose}
          iconComponent={CloseIcon}
          title={intl.formatMessage({
            id: 'account_fields_modal.close',
            defaultMessage: 'Close',
          })}
        />
        <span className={`${classes.modalTitle} dialog-modal__header__title`}>
          <FormattedMessage
            id='account_fields_modal.title'
            defaultMessage="{name}'s info"
            values={{
              name: <DisplayName account={account} variant='simple' />,
            }}
          />
        </span>
      </div>
      <div className='dialog-modal__content'>
        <AnimateEmojiProvider>
          <dl className={classes.modalFieldsList}>
            {account.fields.map((field, index) => (
              <div
                key={index}
                className={`${classes.modalFieldItem} ${classes.fieldCard}`}
              >
                <EmojiHTML
                  as='dt'
                  htmlString={field.name_emojified}
                  extraEmojis={account.emojis}
                  className='translate'
                  {...htmlHandlers}
                />
                <dd>
                  <EmojiHTML
                    as='span'
                    htmlString={field.value_emojified}
                    extraEmojis={account.emojis}
                    {...htmlHandlers}
                  />
                  {!!field.verified_at && (
                    <Icon
                      id='verified'
                      icon={IconVerified}
                      className={classes.fieldIconVerified}
                    />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </AnimateEmojiProvider>
      </div>
    </div>
  );
};
