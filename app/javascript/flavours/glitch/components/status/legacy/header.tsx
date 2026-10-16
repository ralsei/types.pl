import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar } from '@/flavours/glitch/components/avatar';
import { AvatarOverlay } from '@/flavours/glitch/components/avatar_overlay';
import type { DisplayNameProps } from '@/flavours/glitch/components/display_name';
import { LinkedDisplayName } from '@/flavours/glitch/components/display_name';
import type {
  Account,
  AccountShapeFull,
} from '@/flavours/glitch/models/account';
import { selectAccountStatus } from '@/flavours/glitch/selectors/statuses';
import { useAppSelector } from '@/flavours/glitch/store';

export interface StatusHeaderProps {
  statusId: string;
  account?: Account | AccountShapeFull;
  avatarSize?: number;
  contentBeforeDate?: ReactNode;
  contentAfterDate?: ReactNode;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  displayNameProps?: DisplayNameProps;
  onHeaderClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  featured?: boolean;
}

export type StatusHeaderRenderFn = (args: StatusHeaderProps) => ReactNode;

export const StatusHeader: FC<StatusHeaderProps> = ({
  statusId,
  account,
  className,
  avatarSize = 48,
  wrapperProps,
  contentBeforeDate,
  contentAfterDate,
  onHeaderClick,
}) => {
  const status = useAppSelector((state) =>
    selectAccountStatus(state, statusId),
  );
  if (!status) {
    return null;
  }
  const statusAccount = status.account;

  return (
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div
      onClick={onHeaderClick}
      onAuxClick={onHeaderClick}
      {...wrapperProps}
      className={classNames('status__info', className)}
      /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    >
      <StatusDisplayName
        statusAccount={statusAccount}
        friendAccount={account}
        avatarSize={avatarSize}
      />

      {contentBeforeDate}
      {contentAfterDate}
    </div>
  );
};

const StatusDisplayName: FC<{
  statusAccount?: AccountShapeFull;
  friendAccount?: Account | AccountShapeFull;
  avatarSize: number;
}> = ({ statusAccount, friendAccount, avatarSize }) => {
  const AccountComponent = friendAccount ? AvatarOverlay : Avatar;
  return (
    <LinkedDisplayName
      displayProps={{ account: statusAccount }}
      className='status__display-name'
      reference='status'
    >
      <div className='status__avatar'>
        <AccountComponent
          account={statusAccount}
          friend={friendAccount}
          size={avatarSize}
        />
      </div>
    </LinkedDisplayName>
  );
};
