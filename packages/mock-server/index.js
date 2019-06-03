const { Polly } = require('@pollyjs/core');
const HttpAdapter = require('@pollyjs/adapter-node-http');
const FsStoragePersister = require('@pollyjs/persister-fs');

const exitSignals = ['SIGTERM', 'SIGINT'];

class MockServer {
  constructor({ logProvider, pollyOptions }) {
    this.logger = logProvider();

    Polly.register(HttpAdapter);
    Polly.register(FsStoragePersister);

    this.polly = new Polly('polly', pollyOptions);

    exitSignals.forEach(signal => process.on(signal, this.saveRecordings.bind(this)));
  }


  server() {
    return this.polly.server
  }


  async saveRecordings() {
    this.logger.info('Saving recordings before exiting... ( Please don\'t exit yet.');
    await this.polly.stop(); // Saves the recordings
    this.logger.info("Finished saving recordings...");

    exitSignals.forEach(signal => process.removeListener(signal, this.saveRecordings));
  };

  config() {
    return config;
  }
}

module.exports = MockServer;
