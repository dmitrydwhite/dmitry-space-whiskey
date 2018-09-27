import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AssetView from '../AssetView/AssetView';
import ControlsPanel from '../ControlsPanel/ControlsPanel';

/**
 * This component is a wrapper that manages the data transfer between the controls, the asset views,
 * and the WebSocket.
 */
class DataLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayBarrels: [],
      barrels: {},
      satellites: {},
      search: {},
      selectedSat: '',
      viewMode: 'barrel',
    };

    this.searchByCharacter = this.searchByCharacter.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.sortBarrels = this.sortBarrels.bind(this);
    this.switchView = this.switchView.bind(this);
    this.triggerBurn = this.triggerBurn.bind(this);
    this.triggerDetonate = this.triggerDetonate.bind(this);
  }

  componentDidMount() {
    this.manageWsConnection();
  }

  /**
   * Restores the display of barrels to the last set of barrels received from the WS.
   */
  clearSearch = () => {
    this.setState({ displayBarrels: this.lastFullBarrelLoad });
  }

  /**
   * Sets a class prop for the client WebSocket connection.  Handles messages from same.
   */
  manageWsConnection = () => {
    this.interfaceWS = new WebSocket('ws://localhost:5000/sock');

    this.interfaceWS.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        const { barrels, displayBarrels, satellites, search } = newData;

        this.lastFullBarrelLoad = displayBarrels;
        this.setState({ barrels, displayBarrels, satellites, search });
      } catch (e) {
        // Enhancement opportunity: display an error in the UI when the WS is sending bad JSON.
      }
    };
  }

  /**
   * Modifies the state displayBarrels property based on searching in the search data sent from the
   * WS connection.
   */
  searchByCharacter = (searchTerm, searchIn) => {
    const searchSector = searchIn || 'all';

    // I made each one of these a separate const for easier debugging; they could be chained.
    const arrayToCheck = Object.keys(this.state.search[searchSector]);
    const keysHaveSearchTerm = arrayToCheck.filter((k) => {
      return k.indexOf(searchTerm) >= 0;
    });
    const moveExactMatchesToFront = keysHaveSearchTerm.sort((k) => {
      return k === searchTerm ? -1 : 1;
    });
    const convertWordsToAllKeys = moveExactMatchesToFront.reduce((accum, word) => {
      const ret = [...accum];

      this.state.search[searchSector][word].forEach((barrelKey) => {
        if (ret.indexOf(barrelKey) === -1) ret.push(barrelKey);
      })

      return ret;
    }, []);
    const displayBarrels = convertWordsToAllKeys.map((k) => {
      return this.state.barrels[k];
    });

    this.setState({ displayBarrels });
  }

  /**
   * Handles the different types of supported sorting.
   * @param {String} manner Manner of sorting the displayed barrels.
   */
  sortBarrels = (manner) => {
    switch (manner) {
      case 'status': {
        this.setState({
          displayBarrels: this.lastFullBarrelLoad
            .filter(b => b.errors.length === 0)
            .sort((a, b) => a.status > b.status),
        });
        break;
      }
      case 'errors': {
        this.setState({ displayBarrels: this.lastFullBarrelLoad.filter(b => b.errors.length > 0)});
        break;
      }
      case 'last_flavor_sensor_result': {
        this.setState({
          displayBarrels: this.lastFullBarrelLoad
            .filter(b => b.errors.length === 0)
            .sort((a, b) => a.last_flavor_sensor_result > b.last_flavor_sensor_result),
        });
        break;
      }
      case 'most_recent': {
        this.setState({
          displayBarrels: this.lastFullBarrelLoad
            .sort((a, b) =>  b.telemetry_timestamp - a.telemetry_timestamp),
        });
        break;
      }
      default: {
        this.setState({ displayBarrels: this.lastFullBarrelLoad });
        break;
      }
    }
  }

  /**
   * Toggles the view between barrel detail view and satellite detail/command view.
   * @param {[Number]} satId The id of the clicked satellite; display this first in satellite view.
   */
  switchView = (satId) => {
    this.setState({
      viewMode: this.state.viewMode === 'barrel' ? 'satellite' : 'barrel',
      selectedSat: satId || '',
    });
  }

  /**
   * Send the "burn" command to the WS.
   * @param {Number} satId The satellite to BURN.
   */
  triggerBurn = (satId) => {
    this.interfaceWS.send(JSON.stringify({ action: 'BURN', satId }));
  }

    /**
   * Send the "detonate" command to the WS.
   * @param {Number} satId The satellite to DETONATE.
   */
  triggerDetonate = (satId) => {
    this.interfaceWS.send(JSON.stringify({ action: 'DETONATE', satId }));
  }

  render() {
    const { barrels, displayBarrels, satellites, selectedSat, viewMode } = this.state;
    return (
      <Grid container>
        <Grid item xs={12} md={3}>
          <ControlsPanel
            searchByCharacter={this.searchByCharacter}
            clearSearch={this.clearSearch}
            sortBarrels={this.sortBarrels}
            switchView={this.switchView}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <AssetView
            barrels={barrels}
            displayBarrels={displayBarrels}
            satellites={satellites}
            selectedSat={selectedSat}
            switchView={this.switchView}
            triggerBurn={this.triggerBurn}
            triggerDetonate={this.triggerDetonate}
            viewMode={viewMode}
          />
        </Grid>
      </Grid>
    )
  }
}

export default DataLink;