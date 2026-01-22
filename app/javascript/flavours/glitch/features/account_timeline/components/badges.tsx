import type { FC, ReactNode } from 'react';

import {
  AutomatedBadge,
  Badge,
  GroupBadge,
} from '@/flavours/glitch/components/badge';
import { Icon } from '@/flavours/glitch/components/icon';
import { useAccount } from '@/flavours/glitch/hooks/useAccount';
import type { AccountRole } from '@/flavours/glitch/models/account';
import { useAppSelector } from '@/flavours/glitch/store';
import IconAdmin from '@/images/icons/icon_admin.svg?react';

import { isRedesignEnabled } from '../common';

import classes from './redesign.module.scss';

export const AccountBadges: FC<{ accountId: string }> = ({ accountId }) => {
  const account = useAccount(accountId);
  const localDomain = useAppSelector(
    (state) => state.meta.get('domain') as string,
  );
  const badges = [];

  if (!account) {
    return null;
  }

  const className = isRedesignEnabled() ? classes.badge : '';

  if (account.bot) {
    badges.push(<AutomatedBadge key='bot-badge' className={className} />);
  } else if (account.group) {
    badges.push(<GroupBadge key='group-badge' className={className} />);
  }

  const domain = account.acct.includes('@')
    ? account.acct.split('@')[1]
    : localDomain;
  account.roles.forEach((role) => {
    let icon: ReactNode = undefined;
    if (isAdminBadge(role)) {
      icon = (
        <Icon icon={IconAdmin} id='badge-admin' className={classes.badgeIcon} />
      );
    }
    badges.push(
      <Badge
        key={role.id}
        label={role.name}
        className={className}
        domain={isRedesignEnabled() ? `(${domain})` : domain}
        roleId={role.id}
        icon={icon}
      />,
    );
  });

  if (!badges.length) {
    return null;
  }

  return <div className={'account__header__badges'}>{badges}</div>;
};

function isAdminBadge(role: AccountRole) {
  const name = role.name.toLowerCase();
  return isRedesignEnabled() && (name === 'admin' || name === 'owner');
}
