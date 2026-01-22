import type { List } from 'immutable';

import type { CustomEmoji } from '../models/custom_emoji';
import type { Status } from '../models/status';

import { EmojiHTML } from './emoji/html';
import type { IconName } from './media_icon';
import { MediaIcon } from './media_icon';
import { StatusBanner, BannerVariant } from './status_banner';

export const ContentWarning: React.FC<{
  status: Status;
  expanded?: boolean;
  onClick?: () => void;
  icons?: IconName[];
}> = ({ status, expanded, onClick, icons }) => {
  const hasSpoiler = !!status.get('spoiler_text');
  if (!hasSpoiler) {
    return null;
  }

  const text =
    status.getIn(['translation', 'spoilerHtml']) || status.get('spoilerHtml');
  if (typeof text !== 'string' || text.length === 0) {
    return null;
  }

  return (
    <StatusBanner
      expanded={expanded}
      onClick={onClick}
      variant={BannerVariant.Warning}
    >
      {icons?.map((icon) => (
        <MediaIcon
          className='status__content__spoiler-icon'
          icon={icon}
          key={`icon-${icon}`}
        />
      ))}
      <EmojiHTML
        as='span'
        htmlString={text}
        extraEmojis={status.get('emojis') as List<CustomEmoji>}
      />
    </StatusBanner>
  );
};
