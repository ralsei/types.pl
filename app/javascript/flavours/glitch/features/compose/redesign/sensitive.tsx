import { useCallback, useEffect } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { changeComposeSpoilerText } from '@/flavours/glitch/actions/compose';
import { TextInputField } from '@/flavours/glitch/components/form_fields';
import { normalizeKey } from '@/flavours/glitch/components/hotkeys/utils';
import { requestComposerFocus } from '@/flavours/glitch/reducers/slices/composer';
import { useAppDispatch, useAppSelector } from '@/flavours/glitch/store';

import { selectComposeSensitive } from './selectors';
import classes from './styles.module.scss';

const messages = defineMessages({
  sensitiveText: {
    id: 'compose.sensitive.text',
    defaultMessage: 'Content warning',
  },
});

export const ComposeSensitiveField: React.FC<
  React.ComponentPropsWithRef<'input'>
> = (props) => {
  const { sensitive, sensitiveText } = useAppSelector(selectComposeSensitive);

  const intl = useIntl();
  const dispatch = useAppDispatch();
  const isSensitive = useAppSelector((state) => !!state.compose.get('spoiler'));
  useEffect(() => {
    if (!isSensitive) {
      dispatch(requestComposerFocus());
    }
  }, [isSensitive, dispatch]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      dispatch(changeComposeSpoilerText(event.target.value));
    },
    [dispatch],
  );
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const key = normalizeKey(event.key);
      if (key === 'enter') {
        event.preventDefault();
        dispatch(requestComposerFocus());
        return false;
      }
      return;
    },
    [dispatch],
  );
  if (!sensitive) {
    return null;
  }
  return (
    <TextInputField
      {...props}
      className={classes.sensitive}
      label={intl.formatMessage(messages.sensitiveText)}
      value={sensitiveText}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoFocus
    />
  );
};
