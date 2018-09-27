import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { displayTimeSince } from '../utils/utils';


/**
 * Style function for use on Typography titles for Satellite View tables.
 * @returns {Object}
 */
const tableTitleStyle = () => ({
  body1: {
    paddingTop: 48,
    borderTop: '1px solid gray',
  },
});

/**
 * Style function for use on Satellite View tables.
 * @returns {Object}
 */
const mainTableStyle = () => ({
  root: {
    borderTop: '1px solid gray',
  },
})

/**
 * Style function for use on Barrel Info table header rows.
 * @returns {Object}
 */
const barrelInfoHeadStyle = () => ({
  head: {
    backgroundColor: '#2E42B0',
    color: '#2FC4E0',
  },
});

// Three augmented components with styles, for use below.
const StyledTableTitle = withStyles(tableTitleStyle)(Typography);
const StyledInfoTable = withStyles(mainTableStyle)(Table);
const StyledTableHeaderRowCell = withStyles(barrelInfoHeadStyle)(TableCell);

class Satellite extends Component {
  /**
   * Get the most recent barrel update time.
   * @returns {String}
   */
  calculateLastBarrelTime = () => {
    const { satBarrels } = this.props;

    return `${satBarrels
      .sort((a, b) => a.telemetry_timestamp > b.telemetry_timestamp)[0]
      .telemetry_timestamp}`;
  }

  /**
   * Pass through for triggerBurn prop.
   */
  handleBurnClick = () => {
    const { triggerBurn, id } = this.props;

    triggerBurn(id);
  }

  /**
   * Pass through for triggerDetonate prop.
   */
  handleDetonateClick = () => {
    const { triggerDetonate, id } = this.props;

    triggerDetonate(id);
  }

  /**
   * Render method for displaying the barrels that are not in an error state.
   * @returns {React.JSX|String}
   */
  renderNominalBarrelInfo = () => {
    const { satBarrels } = this.props;
    const goodBarrels = satBarrels
      .filter(barrel => barrel.status !== 'error' && barrel.errors.length === 0);

    return goodBarrels.length ?
      (
        <Grid container>
          <Grid item xs={4}>
            <StyledTableTitle variant="body1">Nominal Barrels</StyledTableTitle>
          </Grid>
          <Grid item xs={8}>
            <StyledInfoTable>
              <TableHead>
                <TableRow>
                  <StyledTableHeaderRowCell>Barrel ID</StyledTableHeaderRowCell>
                  <StyledTableHeaderRowCell>Status</StyledTableHeaderRowCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goodBarrels.map((barrel, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{barrel.barrel_id}</TableCell>
                    <TableCell>{barrel.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledInfoTable>
          </Grid>
        </Grid>
      ) : '';
  }

  /**
   * Render method for displaying the barrels that ARE in an error state.
   * @returns {React.JSX|String}
   */
  renderErrorBarrels = () => {
    const { satBarrels } = this.props;
    const barrelErrors = satBarrels
      .filter(barrel => barrel.errors.length > 0)
      .reduce((accum, curr) => {
        return [...accum, ...curr.errors.map(errorText => ({ barrelId: curr.barrel_id, errorText }))];
      }, []);

    return barrelErrors.length ?
      (
        <Grid container>
          <Grid item xs={4}>
            <StyledTableTitle  variant="body1">Barrel Errors</StyledTableTitle>
          </Grid>
          <Grid item xs={8}>
            <StyledInfoTable>
              <TableHead>
                <TableRow>
                  <StyledTableHeaderRowCell>Barrel ID</StyledTableHeaderRowCell>
                  <StyledTableHeaderRowCell>Error</StyledTableHeaderRowCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {barrelErrors.map((errObj, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{errObj.barrelId}</TableCell>
                    <TableCell>{errObj.errorText}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledInfoTable>
          </Grid>
        </Grid>
      ) : '';
  }

  render(){
    const { id, classes } = this.props;
    const lastBarrelTime = this.calculateLastBarrelTime();

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.title}
          avatar={<Avatar children={id} />}
          title={`Satellite ${id}`}
          subheader={`LAST CONTACT ${displayTimeSince(lastBarrelTime)} AGO`}
        />
        <CardContent>
          {this.renderNominalBarrelInfo()}
          {this.renderErrorBarrels()}
        </CardContent>
        <CardActions>
          <Button onClick={this.handleBurnClick} >
            TRIGGER DEORBIT BURN
          </Button>
          <Button onClick={this.handleDetonateClick} >
            DETONATE
          </Button>
        </CardActions>
      </Card>
    );
  }
}

/**
 * Style function for use with default exported component.
 * @returns {Object}
 */
const styles = () => ({
  card: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'left',
  },
});

export default withStyles(styles)(Satellite);