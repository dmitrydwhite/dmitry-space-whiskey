import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import Barrel from '../Barrel/Barrel';
import Satellite from '../Satellite/Satellite';

/**
 * Styles function for use with the barrels table header row.
 * @returns {Object}
 */
const barrelsHeaderStyles = () => ({
  head: {
    backgroundColor: '#2E42B0',
    color: '#2FC4E0',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Custom cells for table header row.
const BarrelsTableHead = withStyles(barrelsHeaderStyles)(TableCell);

/**
 * View Component for displaying the barrels received.
 * @param {Object} param0
 * @prop {Array} barrels The barrels to display.
 * @prop {Object} classes The style classes to apply.
 * @prop {Function} switchView Function switching view to satellite view.
 */
const BarrelsView = ({ barrels, classes, switchView }) => (
  <Paper className={classes.root}>
    <Table>
      <TableHead>
        <TableRow>
          <BarrelsTableHead>Satellite</BarrelsTableHead>
          <BarrelsTableHead>Barrel ID</BarrelsTableHead>
          <BarrelsTableHead>Flavor</BarrelsTableHead>
          <BarrelsTableHead>Status</BarrelsTableHead>
          <BarrelsTableHead>Error</BarrelsTableHead>
          <BarrelsTableHead>
            <p>Time Since Last Update</p>
            <p>DD:HH:MM:SS</p>
          </BarrelsTableHead>
        </TableRow>
      </TableHead>
      <TableBody>
        {barrels.map(barrel => (
          <Barrel key={barrel.barrel_id} switchView={switchView} {...barrel} />
        ))}
      </TableBody>
    </Table>
  </Paper>
);

/**
 * View component for displaying all the satellites we've received info about.
 * @param {Object} param0
 * @prop {Object} barrels All the barrels, in object form for easier mapping.
 * @prop {Object} classes The style classes to apply.
 * @prop {Object} satellites Satellites as ids, with associated barrel ids.
 * @prop {Number} selectedsat A satellited id that has been clicked by a user.
 * @prop {Function} triggerBurn Function sending the trigger burn message up to DataLink.
 * @prop {Function} triggerDetonate Function sending the trigger detonate message up to DataLink.
 */
const SatelliteView = ({
  barrels,
  classes,
  satellites,
  selectedSat,
  triggerBurn,
  triggerDetonate,
}) => (
  <Paper className={classes.root}>
    {Object.keys(satellites).map(satId => (
      <Satellite
        key={satId}
        id={satId}
        satBarrels={satellites[satId].map(barrelId => barrels[barrelId])}
        triggerBurn={triggerBurn}
        triggerDetonate={triggerDetonate}
      />
    )).sort((satObj) => {
      return selectedSat && selectedSat - satObj.props.id;
    })}
  </Paper>
);

/**
 * Style function for augmenting the two subordinate views.
 * @returns {Object}
 */
const viewStyles = () => ({
  root: {
    backgroundColor: 'white',
  },
})

// The two styled components.
const StyledSatelliteView = withStyles(viewStyles)(SatelliteView);
const StyledBarrelsView = withStyles(viewStyles)(BarrelsView);

/**
 * Frame component for displaying either satellite or barrel view.
 * @param {Object} param0
 * @prop {Object} barrels The barrels as an object.
 * @prop {Object} classes The style classes to apply.
 * @prop {Array} displayBarrels The barrels that should be currently displayed.
 * @prop {Object} satellites The satellites arranged by ids.
 * @prop {Number} selectedSat A satellite that the user has clicked on.
 * @prop {Function} switchView Function to toggle between the two views.
 * @prop {Function} triggerBurn Function to send the trigger burn message.
 * @prop {Function} triggerDetonate Function to send the trigger detonate message.
 * @prop {String} viewMode Describing which view to display.
 */
const AssetView = ({
  barrels,
  classes,
  displayBarrels,
  satellites,
  selectedSat,
  switchView,
  triggerBurn,
  triggerDetonate,
  viewMode,
}) => (
  <Paper className={classes.root}>
    {viewMode === 'satellite' ?
      <StyledSatelliteView
        barrels={barrels}
        satellites={satellites}
        selectedSat={selectedSat}
        triggerBurn={triggerBurn}
        triggerDetonate={triggerDetonate}
      /> :
      <StyledBarrelsView barrels={displayBarrels} switchView={switchView} />}
  </Paper>
)

/**
 * Style function for use with default exported component.
 * @returns {Object}
 */
const styles = () => ({
  root: {
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#222',
  },
});

export default withStyles(styles)(AssetView);