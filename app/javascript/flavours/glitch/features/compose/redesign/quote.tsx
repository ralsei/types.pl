import type React from 'react';
import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import { quoteComposeCancel } from '@/flavours/glitch/actions/compose_typed';
import { Avatar } from '@/flavours/glitch/components/avatar';
import { Blurhash } from '@/flavours/glitch/components/blurhash';
import { Card, CardBody, CardTitle } from '@/flavours/glitch/components/card';
import { LinkedDisplayName } from '@/flavours/glitch/components/display_name';
import { EmojiHTML } from '@/flavours/glitch/components/emoji/html';
import { RelativeTimestamp } from '@/flavours/glitch/components/relative_timestamp';
import type { AccountStatusShape } from '@/flavours/glitch/models/status';
import { selectAccountStatus } from '@/flavours/glitch/selectors/statuses';
import { useAppDispatch, useAppSelector } from '@/flavours/glitch/store';
import type { OnElementHandler } from '@/flavours/glitch/utils/html';

import classes from './attachments.module.scss';

export const ComposeQuote: React.FC<{ id: string }> = ({ id }) => {
  const status = useAppSelector((state) => selectAccountStatus(state, id));

  const dispatch = useAppDispatch();
  const handleDelete = useCallback(() => {
    dispatch(quoteComposeCancel());
  }, [dispatch]);

  if (!status) {
    return null;
  }

  let imageEle: React.ReactNode = null;
  const image = status.media_attachments.find(({ type }) => type !== 'unknown');
  if (image) {
    imageEle = !status.sensitive ? (
      <img src={image.preview_url} alt={image.description} />
    ) : (
      <Blurhash hash={image.blurhash} width={120} />
    );
  }

  const statusTo = `/@${status.account.acct}/${status.id}`;

  return (
    <Card image={imageEle} onDelete={handleDelete}>
      <CardTitle
        className={classes.quoteTitle}
        image={
          <Avatar
            account={status.account}
            className={classes.quoteAccountLink}
            withLink
          />
        }
        afterContent={
          <Link to={statusTo}>
            <RelativeTimestamp timestamp={status.created_at} />
          </Link>
        }
      >
        <LinkedDisplayName
          displayProps={{ account: status.account, variant: 'noDomain' }}
          className={classes.quoteAccountLink}
        />
      </CardTitle>

      <CardBody className={classes.quoteBody} as={Link} to={statusTo}>
        {!status.spoiler_text ? (
          <ComposeQuoteBody status={status} />
        ) : (
          <div className={classes.quoteSpoiler}>
            <FormattedMessage
              id='compose.quote.spoiler'
              defaultMessage='Content:'
              description='Comes before user-provided spoiler description'
            />
            &nbsp;
            {status.spoiler_text}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const ComposeQuoteBody: React.FC<{
  status: AccountStatusShape;
}> = ({ status }) => {
  return (
    <EmojiHTML
      htmlString={status.translation?.contentHtml ?? status.contentHtml}
      extraEmojis={status.emojis}
      lang={status.translation?.language ?? status.language}
      onElement={onStatusLinks}
    />
  );
};

const onStatusLinks: OnElementHandler = (element, { key }, children) => {
  if (element instanceof HTMLAnchorElement) {
    return <span key={key as string}>{children}</span>;
  }
  return undefined;
};
