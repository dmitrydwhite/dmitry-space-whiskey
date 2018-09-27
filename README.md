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
2. start the dev server on port :5000 (code can be found in `./server_cli/src/index.js`)
3. start the json posting cli in the terminal window you have open (code can be found in `./server_cli/startcli.js`)

* UI will start showing up once satellite / barrel data is added.

## How I Built This Thing

* I used `create-react-app` to stand up the front end UI, and built the components using Material UI.
* For the server, I used `express` and `express-ws` for the WebSocket functionality.
* For the cli, I used `child_process` for making all three node thingies start up from the same terminal window and start command, `readline` for cli interactions, `fs` and `path` to pull JSON from files, and `isomorphic-fetch` to talk to the server from the cli.