const fetch = require('isomorphic-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec, fork } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Poster {
  constructor() {
    this.mainQuestion = 'Provide an absolute path to JSON for the Moon Shots server:>\n:>';

    this.absolutePathErrorMessage = '\n⚠ >>> Provided path was not an absolute path.\n';
    this.jsonParseError = '\n⚠ >>> Could not parse file contents as JSON.\n';
    this.postError = '\n⚠ >>> Error posting JSON to server.\n';
    this.postSuccessMessage = '\nJSON POST SUCCESS ★\n'
    this.readFileError = '\n⚠ >>> Could not read from provided file.\n';

    this.ask = this.ask.bind(this);
    this.outputMsg = this.outputMsg.bind(this);
    this.handlePath = this.handlePath.bind(this);
  }

  ask() {
    rl.question(this.mainQuestion, this.handlePath);
  }

  outputMsg(textErr, err) {
    if (err) console.error(err);
    console.log(textErr);
    this.ask();
  }

  handlePath(providedPath) {
    let fileContents;

    if (providedPath === '') return this.ask();

    if (path.isAbsolute(providedPath, 'utf8')) {
      try {
        fileContents = fs.readFileSync(providedPath);
      } catch (e) {
        return this.outputMsg(this.readFileError, e);
      }

      try {
        JSON.parse(fileContents);
      } catch (e) {
        return this.outputMsg(this.jsonParseError, e);
      }

      fetch('http://localhost:5000', {
        method: 'post',
        body: fileContents,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        this.outputMsg(
          res.ok ? this.postSuccessMessage : this.postError,
          res.ok ? '' : res.status,
        );
      })
      .catch((e) => {
        this.outputMsg(this.postError, e);
        this.ask();
      });

    } else {
      this.outputMsg(this.absolutePathErrorMessage);
    }
  }
}

fork('./server_cli/bundle/index.js');
exec('react-scripts start');

const asker = new Poster();

// This seems to run before the server has started; I'm waiting here to make it look a little nicer.
setTimeout(asker.ask, 700);