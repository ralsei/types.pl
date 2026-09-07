import type { FC } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { ColumnHeader } from '@/flavours/glitch/components/column/header';
import PersonIcon from '@/material-icons/400-24px/person.svg?react';

const messages = defineMessages({
  profile: { id: 'column_header.profile', defaultMessage: 'Profile' },
});

interface ProfileColumnHeaderProps {
  multiColumn: boolean;
}

export const ProfileColumnHeader: FC<ProfileColumnHeaderProps> = ({
  multiColumn,
}) => {
  const intl = useIntl();

  return (
    <ColumnHeader
      icon='user-circle'
      iconComponent={PersonIcon}
      title={intl.formatMessage(messages.profile)}
      scrollTopOnClick
      showBackButton
      multiColumn={multiColumn}
    />
  );
};
