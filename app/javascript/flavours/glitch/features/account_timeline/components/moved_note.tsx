import { FormattedMessage } from 'react-intl';

import { AvatarOverlay } from 'flavours/glitch/components/avatar_overlay';
import { DisplayName } from 'flavours/glitch/components/display_name';
import { Permalink } from 'flavours/glitch/components/permalink';
import { useAppSelector } from 'flavours/glitch/store';

export const MovedNote: React.FC<{
  accountId: string;
  targetAccountId: string;
}> = ({ accountId, targetAccountId }) => {
  const from = useAppSelector((state) => state.accounts.get(accountId));
  const to = useAppSelector((state) => state.accounts.get(targetAccountId));

  return (
    <div className='moved-account-banner'>
      <div className='moved-account-banner__message'>
        <FormattedMessage
          id='account.moved_to'
          defaultMessage='{name} has indicated that their new account is now:'
          values={{
            name: (
              <bdi>
                <strong
                  dangerouslySetInnerHTML={{
                    __html: from?.display_name_html ?? '',
                  }}
                />
              </bdi>
            ),
          }}
        />
      </div>

      <div className='moved-account-banner__action'>
        <Permalink
          to={`/@${to?.acct}`}
          href={to?.url}
          className='detailed-status__display-name'
        >
          <div className='detailed-status__display-avatar'>
            <AvatarOverlay account={to} friend={from} />
          </div>
          <DisplayName account={to} />
        </Permalink>

        <Permalink to={`/@${to?.acct}`} href={to?.url} className='button'>
          <FormattedMessage
            id='account.go_to_profile'
            defaultMessage='Go to profile'
          />
        </Permalink>
      </div>
    </div>
  );
};
