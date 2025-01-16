import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import BlockIcon from '@/material-icons/400-24px/block.svg?react';
import InfoIcon from '@/material-icons/400-24px/info.svg?react';
import MoreHorizIcon from '@/material-icons/400-24px/more_horiz.svg?react';
import PushPinIcon from '@/material-icons/400-24px/push_pin.svg?react';
import StarIcon from '@/material-icons/400-24px/star-fill.svg?react';
import VolumeOffIcon from '@/material-icons/400-24px/volume_off.svg?react';
import Column from 'flavours/glitch/features/ui/components/column';
import ColumnLink from 'flavours/glitch/features/ui/components/column_link';
import ColumnSubheading from 'flavours/glitch/features/ui/components/column_subheading';
import { identityContextPropShape, withIdentity } from 'flavours/glitch/identity_context';

const messages = defineMessages({
  heading: { id: 'column.heading', defaultMessage: 'Misc' },
  subheading: { id: 'column.subheading', defaultMessage: 'Miscellaneous options' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favorites' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Blocked domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned posts' },
  keyboard_shortcuts: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Keyboard shortcuts' },
});

class GettingStartedMisc extends ImmutablePureComponent {

  static propTypes = {
    identity: identityContextPropShape,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render () {
    const { intl } = this.props;
    const { signedIn } = this.props.identity;

    return (
      <Column icon='ellipsis-h' iconComponent={MoreHorizIcon} heading={intl.formatMessage(messages.heading)} alwaysShowBackButton>
        <div className='scrollable'>
          <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
          {signedIn && (<ColumnLink key='favourites' icon='star' iconComponent={StarIcon} text={intl.formatMessage(messages.favourites)} to='/favourites' />)}
          {signedIn && (<ColumnLink key='pinned' icon='thumb-tack' iconComponent={PushPinIcon} text={intl.formatMessage(messages.pins)} to='/pinned' />)}
          {signedIn && (<ColumnLink key='mutes' icon='volume-off' iconComponent={VolumeOffIcon} text={intl.formatMessage(messages.mutes)} to='/mutes' />)}
          {signedIn && (<ColumnLink key='blocks' icon='ban' iconComponent={BlockIcon} text={intl.formatMessage(messages.blocks)} to='/blocks' />)}
          {signedIn && (<ColumnLink key='domain_blocks' icon='minus-circle' iconComponent={BlockIcon} text={intl.formatMessage(messages.domain_blocks)} to='/domain_blocks' />)}
          <ColumnLink key='shortcuts' icon='question' iconComponent={InfoIcon} text={intl.formatMessage(messages.keyboard_shortcuts)} to='/keyboard-shortcuts' />
        </div>
      </Column>
    );
  }

}

export default connect()(withIdentity(injectIntl(GettingStartedMisc)));
