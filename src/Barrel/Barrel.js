import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { displayTimeSince } from '../utils/utils';


class Barrel extends Component {
  /**
   * Helper method for rendering all status, flavor, or errors updates as an error icon with a
   * tooltip displaying the barrel errors.
   * @param {[String]} comp The status update
   * @returns {React.JSX|String} Error Icon or the original text if not 'error'.
   */
  renderError = (comp) => {
    const errorMarkup = (
      <Tooltip title={
        ['Errors:', ...this.props.errors].map((error, idx) => (<p key={idx}>{error}</p>))
      }>
        <span>
          <Button disabled>
            <i className="material-icons">error</i>
          </Button>
        </span>
      </Tooltip>
    );

    if (comp) {
      return comp.toLowerCase() === 'error' ? errorMarkup : comp;
    }

    return errorMarkup;
  }

  /**
   * Pass through method for switching to satellite view.
   */
  switchToSatView = () => {
    const { satellite_id, switchView } = this.props;

    switchView(satellite_id);
  }

  render() {
    const {
      barrel_id,
      errors,
      last_flavor_sensor_result,
      satellite_id,
      status,
      telemetry_timestamp,
    } = this.props;

    return (
      <TableRow>
        <TableCell>
          <Tooltip title="Click any Satellite to view Sat Details and Commands">
            <a onClick={this.switchToSatView}>
              <Avatar children={satellite_id} />
            </a>
          </Tooltip>
        </TableCell>
        <TableCell>{barrel_id}</TableCell>
        <TableCell>{this.renderError(last_flavor_sensor_result)}</TableCell>
        <TableCell>{this.renderError(status)}</TableCell>
        <TableCell>{errors && errors.length ? this.renderError() : ''}</TableCell>
        <TableCell>{displayTimeSince(telemetry_timestamp)}</TableCell>
      </TableRow>
    );
  }
}

export default Barrel;