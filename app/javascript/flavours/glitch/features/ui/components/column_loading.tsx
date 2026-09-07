import { Column } from '@/flavours/glitch/components/column';
import { ColumnHeader } from '@/flavours/glitch/components/column/header';
import type { ColumnHeaderProps } from '@/flavours/glitch/components/column/header';

export const ColumnLoading: React.FC<ColumnHeaderProps> = (otherProps) => (
  <Column>
    <ColumnHeader {...otherProps} />
    <div className='scrollable' />
  </Column>
);
