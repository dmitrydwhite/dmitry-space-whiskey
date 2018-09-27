import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';


/**
 * @type {Array}
 * Different areas to specify the search in.
 */
const searchMenuItems = [
  {
    text: 'Status',
    filter: 'status',
  }, {
    text: 'Error',
    filter: 'errors',
  }, {
    text: 'Flavor',
    filter: 'last_flavor_sensor_result',
  }, {
    text: 'All',
    filter: 'all',
  }, {
    text: 'Clear Entry',
    filter: 'clear_entry',
  },
];

/**
 * @type {Array}
 * Different ways to sort the barrels.
 */
const sortMenuItems = [
  {
    text: 'Status',
    filter: 'status',
  }, {
    text: 'Error',
    filter: 'errors',
  }, {
    text: 'Flavor',
    filter: 'last_flavor_sensor_result',
  }, {
    text: 'Most Recent',
    filter: 'most_recent',
  }, {
    text: 'All',
    // filter: 'clear_entry',
    filter: '',
  }
];

class ControlsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { searchIn: '', searchTerm: '', sortBy: '' };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.sortByAttribute = this.sortByAttribute.bind(this);
  }

  /**
   * Manage the state of the search input, and pass the search term through to the DataLink.
   * @param {React.SyntheticEvent} event The input change event.
   */
  handleSearchInputChange = (event) => {
    // Coding for multiple word searches is hard :(
    if (event.target.value.indexOf(' ') > -1) {
      event.target.value = event.target.value.replace(' ', '');
    }

    const searchTerm = event.target.value;
    const { searchIn } = this.state;


    this.setState({ searchTerm });

    this.props.searchByCharacter(searchTerm.trim(), searchIn);
  }

  /**
   * Pass through method for clearSearch.
   */
  clearSearch = () => {
    this.props.clearSearch();
  }

  /**
   * Handle the change of the dropdown for fields to search in.
   * @param {React.SyntheticEvent} event 
   */
  setSearchFilter = (event) => {
    const searchIn = event.target.value;
    const { searchTerm } = this.state;

    // Clear the search if the user wants to get out of searching in certain fields.
    if (searchIn === 'clear_entry') {
      this.clearSearch();
      
      this.setState({ searchIn: 'all', searchTerm: '' });
    } else {
      if (searchIn !== this.state.searchIn) {
        this.props.searchByCharacter(searchTerm, searchIn);
      }

      this.setState({ searchIn });
    }
  }

  /**
   * Handle the change of the dropdown for sorting; update state and pass through to DataLink.
   * @param {React.SyntheticEvent} event The change event on the dropdown.
   */
  sortByAttribute = (event) => {
    const sortBy = event.target.value;

    this.props.sortBarrels(sortBy);

    this.setState({ sortBy });
  }

  render() {
    const { switchView, classes } = this.props;
    return (
      <Paper>
        <Button className={classes.switchBtn} variant="outlined" onClick={switchView}>
          SWITCH VIEW
        </Button>
        <Grid container>
          <Grid item xs={6}>
            <form noValidate autoComplete="off">
              <TextField
                id="standard-name"
                label="Search"
                onChange={this.handleSearchInputChange}
                margin="normal"
                value={this.state.searchTerm}
              />
            </form>
          </Grid>
          <Grid item xs={6}>
            <form autoComplete="off">
              <FormControl className={classes.searchFormControl}>
                <InputLabel htmlFor="search-filter">Category</InputLabel>
                <Select
                  value={this.state.searchIn}
                  onChange={this.setSearchFilter}
                  inputProps={{
                    name: 'searchFilter',
                    id: 'search-filter',
                  }}
                >
                  {searchMenuItems.map((item, idx) => (
                    <MenuItem value={item.filter} key={`${item.filter}-${idx}`}>{item.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <form autoComplete="off">
              <FormControl className={classes.sortFormControl}>
                <InputLabel htmlFor="sort-menu">Sort Barrels</InputLabel>
                <Select
                  value={this.state.sortBy}
                  onChange={this.sortByAttribute}
                  inputProps={{
                    name: 'sortFilter',
                    id: 'sort-menu',
                  }}
                >
                  {sortMenuItems.map((item, idx) => (
                    <MenuItem value={item.filter} key={`${item.filter}-${idx}`}>{item.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </Paper>
    )
  };
}

/**
 * Style function for use with default exported component.
 * @returns {Object}
 */
const styles = () => ({
  searchFormControl: {
    margin: 16,
    minWidth: 88,
  },
  sortFormControl: {
    margin: 16,
    minWidth: 176,
  },
  switchBtn: {
    margin: 8,
  }
});

export default withStyles(styles)(ControlsPanel);
