import express from 'express';
import expressWs from 'express-ws';

const app = express();

const port = 5000;
const appIntro = `
MOON SHOT™ Back End Utility Server
by Dmitry White
Server listening on Port:${port}...
`;

let hasReceivedSatData = false;

const requiredProps = [
  { propName: 'barrels', errDescription: 'Array', propType: 'object', isArray: Array.isArray },
  { propName: 'satellite_id', errDescription: 'Number', propType: 'number' },
  { propName: 'telemetry_timestamp', errDescription: 'Number', propType: 'number' },
];

let serverSatData = {
  barrels: {},
  satellites: {},
  search: {
    errors: {},
    last_flavor_sensor_result: {},
    status: {},
    all: {},
  },
};

const log = (...args) => console.log(`\n[ MS™ B.E.U.S. ] - ${new Date(Date.now()).toTimeString()} -`, ...args);

const newManager = function () {
  function hasWs() {
    return !!this.ws;
  }

  function add(webSocketConnection) {
    log('added a web socket');
    this.ws = webSocketConnection;

    this.ws.onmessage = (message) => {
      const { data } = message;
      const { action, satId } = JSON.parse(data || {});
      log(`Received command ${action} for satellite ${satId}...`);
    }
  }

  function send(data) {
    log('sending to websocket:', data);
    if (this.hasWs()) {
      this.ws.send(data);
    }
  }

  function clear() {
    this.ws = null;
    log('cleared web socket connection');
  }

  return { add, clear, hasWs, send };
};

const webSocketManager = newManager();

const addIfNotInArray = (arr, item) => {
  const ret = arr || [];

  return Array.isArray(ret) && ret.indexOf(item) === -1 ? [...ret, item] : ret;
};

const normalize = (update, satData) => {
  const { satellite_id, telemetry_timestamp } = update;

  update.barrels.forEach((received) => {
    const { barrel_id } = received;

    // Update the server data set for this barrel id under barrels
    satData.barrels[barrel_id] = { ...received, telemetry_timestamp, satellite_id };

    // Make sure to associate this barrel id with the current satellite
    satData.satellites[satellite_id] = addIfNotInArray(satData.satellites[satellite_id], barrel_id);

    // Apply all the text we found into the appropriate search buckets
    ['errors', 'last_flavor_sensor_result', 'status'].forEach((prop) => {
      const strings = Array.isArray(received[prop]) ? received[prop].join(' ') : received[prop] || '';

      strings.split(' ').filter(x => x).forEach((term) => {
        satData.search[prop][term] = addIfNotInArray(satData.search[prop][term], barrel_id);
        satData.search.all[term] = addIfNotInArray(satData.search.all[term], barrel_id);
      });
    });

    received.errors.forEach((errorTerm) => {
      satData.search.errors[errorTerm] = addIfNotInArray(satData.search.errors[errorTerm], barrel_id);
    });
  });

  return satData;
}

const generateTransmitData = (data) => {
  const transmitData = {
    ...data,
    // Send displayBarrels as an Array, for the client's convenience, with most recent barrels first:
    displayBarrels: Object.keys(data.barrels)
      .map(key => data.barrels[key])
      .sort((a, b) => b.telemetry_timestamp - a.telemetry_timestamp),
  };

  return JSON.stringify(transmitData);
}

const handleJson = (req, res) => {
  try {
    const receivedSatData = req.body;

    requiredProps.forEach((prop) => {
      const {
        errDescription,
        propName,
        propType,
        isArray = x => x,
      } = prop;
      const isValid = typeof receivedSatData[propName] === propType
        && isArray(receivedSatData[propName]);

      if (!isValid) {
        throw new Error(`Property ${propName} of type ${errDescription} required`);
      }
    });

    serverSatData = normalize(receivedSatData, serverSatData);

    webSocketManager.send(generateTransmitData(serverSatData));
    // webSocketManager.send(JSON.stringify(transmitData));

    hasReceivedSatData = true;

    res.status(200).send('OK').end();
  } catch (error) {
    log(`Server error ${error}`);
    res.status(500).json({error: `Server error ${error}`}).end();
  }
};

const manageWebSocket = (ws, req) => {
  webSocketManager.add(ws);
  if (hasReceivedSatData) webSocketManager.send(generateTransmitData(serverSatData));
  ws.onclose = () => webSocketManager.clear();
}

expressWs(app);
app.use(express.json());
app.post('/', (req, res) => {
  try {
    handleJson(req, res);
  } catch (error) {
    log(`Server error ${error}`);
    ws.send(JSON.stringify({ error }));
  }
});
app.ws('/sock', manageWebSocket);
app.listen(port, log(appIntro));