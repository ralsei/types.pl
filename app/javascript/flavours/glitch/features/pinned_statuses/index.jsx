import PropTypes from 'prop-types';

import { defineMessages } from 'react-intl';

import { Helmet } from '@unhead/react/helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import PushPinIcon from '@/material-icons/400-24px/push_pin.svg?react';
import { fetchPinnedStatuses } from '@/flavours/glitch/actions/pin_statuses';
import { Column } from '@/flavours/glitch/components/column';
import { injectIntl } from '@/flavours/glitch/components/intl';
import StatusList from '@/flavours/glitch/components/status_list';
import { getStatusList } from '@/flavours/glitch/selectors';
import { ColumnHeader } from '@/flavours/glitch/components/column/header';


const messages = defineMessages({
  heading: { id: 'column.pins', defaultMessage: 'Pinned post' },
});

const mapStateToProps = state => ({
  statusIds: getStatusList(state, 'pins'),
  hasMore: !!state.getIn(['status_lists', 'pins', 'next']),
});

class PinnedStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    hasMore: PropTypes.bool.isRequired,
    multiColumn: PropTypes.bool,
  };

  componentDidMount () {
    this.props.dispatch(fetchPinnedStatuses());
  }

  render () {
    const { intl, statusIds, hasMore, multiColumn } = this.props;

    return (
      <Column bindToDocument={!multiColumn}>
        <ColumnHeader icon='thumb-tack' iconComponent={PushPinIcon} title={intl.formatMessage(messages.heading)} showBackButton />
        <StatusList
          statusIds={statusIds}
          scrollKey='pinned_statuses'
          hasMore={hasMore}
          bindToDocument={!multiColumn}
        />
        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(PinnedStatuses));
