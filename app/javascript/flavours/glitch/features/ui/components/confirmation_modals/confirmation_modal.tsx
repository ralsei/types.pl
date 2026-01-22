import { useCallback } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';

import { Button } from 'flavours/glitch/components/button';

export interface BaseConfirmationModalProps {
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- keep the message around while we find a place to show it
const messages = defineMessages({
  doNotAskAgain: {
    id: 'confirmation_modal.do_not_ask_again',
    defaultMessage: 'Do not ask for confirmation again',
  },
});

export const ConfirmationModal: React.FC<
  {
    title: React.ReactNode;
    message?: React.ReactNode;
    confirm: React.ReactNode;
    cancel?: React.ReactNode;
    secondary?: React.ReactNode;
    onSecondary?: () => void;
    onConfirm: () => void;
    closeWhenConfirm?: boolean;
    extraContent?: React.ReactNode;
  } & BaseConfirmationModalProps
> = ({
  title,
  message,
  confirm,
  cancel,
  onClose,
  onConfirm,
  secondary,
  onSecondary,
  closeWhenConfirm = true,
  extraContent,
}) => {
  const handleClick = useCallback(() => {
    if (closeWhenConfirm) {
      onClose();
    }

    onConfirm();
  }, [onClose, onConfirm, closeWhenConfirm]);

  const handleSecondary = useCallback(() => {
    onClose();
    onSecondary?.();
  }, [onClose, onSecondary]);

  return (
    <div className='modal-root__modal safety-action-modal'>
      <div className='safety-action-modal__top'>
        <div className='safety-action-modal__confirmation'>
          <h1>{title}</h1>
          {message && <p>{message}</p>}

          {extraContent}
        </div>
      </div>

      <div className='safety-action-modal__bottom'>
        <div className='safety-action-modal__actions'>
          <button onClick={onClose} className='link-button' type='button'>
            {cancel ?? (
              <FormattedMessage
                id='confirmation_modal.cancel'
                defaultMessage='Cancel'
              />
            )}
          </button>

          {secondary && (
            <>
              <div className='spacer' />
              <button
                onClick={handleSecondary}
                className='link-button'
                type='button'
              >
                {secondary}
              </button>
            </>
          )}

          {/* eslint-disable-next-line jsx-a11y/no-autofocus -- we are in a modal and thus autofocusing is justified */}
          <Button onClick={handleClick} autoFocus>
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};
