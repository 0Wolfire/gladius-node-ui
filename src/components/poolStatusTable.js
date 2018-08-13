import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Card from './card';
import Table from './shared/table';
import poolPropType from '../propTypes/pool';
import {
  applicationsSelectors,
  applicationsActions
} from '../state/ducks/applications/';
import bemify from '../util/bemify';

const bem = bemify('pool-status-table');
const {
  getPendingApplications,
  getRejectedApplications,
  getAcceptedApplications,
  isPending,
  isRejected,
  isAccepted
} = applicationsSelectors;
const {
  getApplications,
} = applicationsActions;

export class BasePoolStatusTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRejected: false
    };

    this.setShowRejected = this.setShowRejected.bind(this);
  }

  componentWillMount() {
    this.props.getApplications();
    this.requestInterval = setInterval(() => {
      this.props.getApplications();
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.requestInterval);
  }

  setShowRejected(show) {
    this.setState({showRejected: show});
  }

  renderStatus(application) {
    let text = '—';
    let status;

    if (isAccepted(application)) {
      text = 'Accepted';
      status = 'accepted';
    }

    if (isRejected(application)) {
      text = 'Rejected';
      status = 'rejected';
    }

    if (isPending(application)) {
      text = 'Pending';
      status = 'pending';
    }

    return (
      <span className={classnames(bem('status'), status)}>
        {text}
      </span>
    );
  }

  renderEmptyValue() {
    return (
      <span>—</span>
    );
  }

  renderJoinButton(application) {
    if (isAccepted(application)) {
      return (
        <button className="btn btn-primary">Join</button>
      );
    }

    return null;
  }

  renderName(application) {
    const { name } = application.pool;

    if (!name) {
      return this.renderEmptyValue();
    }

    return name;
  }

  renderBandwidth(application) {
    const { bandwidth } = application.pool;
    if (!bandwidth && isNaN(bandwidth)) {
      return this.renderEmptyValue();
    }

    return (
      <span>{application.pool.bandwidthUse}GB</span>
    );
  }

  renderNodeCount(application) {
    const { nodeCount } = application.pool;
    if (!nodeCount && isNaN(nodeCount)) {
      return this.renderEmptyValue();
    }

    return nodeCount;
  }

  renderEarnings(application) {
    const { earnings } = application.pool;
    if (!earnings) {
      return this.renderEmptyValue();
    }

    return (
      <span>
        <img src="./assets/images/icon-logo-small.svg" alt="" className="mr-2" />
        {application.pool.earnings} GLA
      </span>
    );
  }

  getTableHeader(hideHead) {
    return (
      <Table.Header className={classnames({'hidden-header': hideHead})}>
        <Table.Row>
          <Table.HeaderCell
            className={classnames(bem('header-cell'), 'name')}
            sorted="">
            { hideHead ? null : 'Pool' }
          </Table.HeaderCell>
          <Table.HeaderCell
            className={classnames(bem('header-cell'), 'status')}
            sorted="">
            { hideHead ? null : 'Application' }
          </Table.HeaderCell>
          <Table.HeaderCell
            className={classnames(bem('header-cell'), 'bandwidth')}
            sorted="">
            { hideHead ? null : 'Bandwidth' }
          </Table.HeaderCell>
          <Table.HeaderCell
            className={classnames(bem('header-cell'), 'nodes')}
            sorted="">
            { hideHead ? null : 'Nodes' }
          </Table.HeaderCell>
          <Table.HeaderCell
            className={classnames(bem('header-cell'), 'earnings')}
            sorted="">
            { hideHead ? null : 'Earnings' }
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  getTable(applications, hideHead) {
    return (
      <Table className="table">
        {this.getTableHeader(hideHead)}
        <Table.Body>
          {applications.map(p => this.getPoolRow(p))}
        </Table.Body>
      </Table>
    );
  }

  getRejectedApplications(applications) {
    if (this.state.showRejected) {
      return this.getTable(applications, true);
    }

    return null;
  }

  getPoolRow(application) {
    return (
      <Table.Row
        key={application.pool.address}
        className={classnames(bem('pool-row'))}
      >
        <Table.Cell>{this.renderName(application)}</Table.Cell>
        <Table.Cell>{this.renderStatus(application)}</Table.Cell>
        <Table.Cell>{this.renderBandwidth(application)}</Table.Cell>
        <Table.Cell>{this.renderNodeCount(application)}</Table.Cell>
        <Table.Cell>{this.renderEarnings(application)}</Table.Cell>
      </Table.Row>
    );
  }

  getEmptyRow(applications) {
    if (!applications || applications.length === 0) {
      return (
        <div className="text-center text-muted p-3">
          You currently have no applications.
        </div>
      );
    }

    return null;
  }

  getShowButton() {
    let buttonText = 'Show Rejected Pools';
    let toggleValue = true;
    let icon = 'down';

    if (this.state.showRejected) {
      buttonText = 'Hide Rejected Pools';
      toggleValue = false;
      icon = 'up';
    }

    return (
      <div
        onClick={this.setShowRejected.bind(this, toggleValue)}
        className={classnames(bem('show-rejected p-2'))}
      >
        {buttonText}
        <img src={`./assets/images/icon-chevron-${icon}.svg`} alt="" />
      </div>
    );
  }

  getRejectedSection(rejectedApplications) {
    if (!rejectedApplications || rejectedApplications.length === 0) {
      return null;
    }

    return (
      <div className={classnames(bem('rejected-container'))}>
        {this.getShowButton()}
        {this.getRejectedApplications(rejectedApplications)}
      </div>
    );
  }

  render() {
    const {
      className,
      applications,
      rejectedApplications,
    } = this.props;

    return (
      <div className={classnames(bem(), className)}>
        <Card noPadding>
          {this.getTable(applications)}
          {this.getEmptyRow(applications)}
          {this.getRejectedSection(rejectedApplications)}
        </Card>
      </div>
    );
  }
}

BasePoolStatusTable.defaultProps = {
  className: '',
};

/* eslint react/no-unused-prop-types: "off" */
BasePoolStatusTable.propTypes = {
  className: PropTypes.string,
  getApplications: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const applications = state.applications.applications;
  return {
    applications: [
      ...getAcceptedApplications(applications),
      ...getPendingApplications(applications)
    ],
    rejectedApplications: getRejectedApplications(applications),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getApplications: () => dispatch(getApplications()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasePoolStatusTable);
