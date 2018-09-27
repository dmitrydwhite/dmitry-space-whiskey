# `dmitry-space-whiskey`

## How to Run This Thing

* clone this repo into the dir of your choice.
* open up a new terminal window.

```sh
$ cd dir-of-your-choice
$ npm install
$ npm run start
```

* this should do three things:
1. start the frontend dev server and open a browser window at localhost:3000 or so (thanks, `create-react-app`! 👍)
2. start the dev back-end utility server on port :5000 (code can be found in `./server_cli/src/index.js`)
3. start the json posting cli in the terminal window you have open (code can be found in `./server_cli/startcli.js`)

* UI will start showing up once satellite / barrel data is added.

## How to Use This Thing

* Navigate to localhost:3000 to see the UI.  Probably no info there yet.
* In the terminal with the dev window, enter the absolute path to a JSON file with satellite / barrel data.
* (If you don't see the little prompt `:>` just hit enter, it should show up.  I'm outputting both the server output and the cli output to the same terminal, so sometimes the server output will step on the cli.)
* When valid satellite / barrel JSON is submitted, the server should consume it and spit it out through the WebSocket to the browser.
* Now if you switch back over to the browser, you should see the data from the JSON you submitted.
* Right now the dev back-end utility server only supports one WebSocket connection at a time.  Adding more would definitely be an enhancement opportunity.
* If you close the browser window, the back-end server will keep a copy of the data.  If you re-open another session on localhost:3000, you should still get the same data that the server had before, and any other data that's been POST-ed since you closed the browser session.  Killing the server will lose all the data that's been posted to it.  Another enhancement opportunity would be to submit the data the server gets from a POST to a database, so the data doesn't just last the lifetime of a server instance.

## How I Built This Thing

* I used `create-react-app` to stand up the front end UI, and built the components using Material UI.
* For the server, I used `express` and `express-ws` for the WebSocket functionality.
* For the cli, I used `child_process` for making all three node thingies start up from the same terminal window and start command, `readline` for cli interactions, `fs` and `path` to pull JSON from files, and `isomorphic-fetch` to talk to the server from the cli.