import { EmojiHTML } from '@/flavours/glitch/components/emoji/html';
import { useStatus } from '@/flavours/glitch/hooks/useStatus';

import { StatusBanner, BannerVariant } from './banner';
import type { IconName } from './media_icon';
import { MediaIcon } from './media_icon';

export const ContentWarning: React.FC<{
  statusId: string;
  expanded?: boolean;
  onClick?: () => void;
  icons?: IconName[];
}> = ({ statusId, expanded, onClick, icons }) => {
  const status = useStatus(statusId);
  const hasSpoiler = !!status?.spoiler_text;
  const text = status?.translation?.spoilerHtml ?? status?.spoilerHtml;
  if (!hasSpoiler || !text) {
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
      <EmojiHTML as='span' htmlString={text} extraEmojis={status.emojis} />
    </StatusBanner>
  );
};
