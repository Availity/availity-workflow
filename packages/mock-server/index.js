const { Polly } = require('@pollyjs/core');
const HttpAdapter = require('@pollyjs/adapter-node-http');
const FsStoragePersister = require('@pollyjs/persister-fs');
const path = require('path');

const exitSignals = ['SIGTERM', 'SIGINT'];

class MockServer {
  constructor(mockConfig) {
    this.logger = mockConfig.logProvider();

    Polly.register(HttpAdapter);
    Polly.register(FsStoragePersister);

    this.polly = new Polly('NanoMixtape', {
      adapters: ['node-http'],
      persister: 'fs',
      mode: 'replay',
      // recordIfMissing: true,
      persisterOptions: {
        fs: {
          recordingsDir: path.join(process.cwd(), 'project/static/recordings')
        }
      },
      matchRequestsBy: {
        order: false, // We can call in any order
        headers: {
          exclude: ['cookie']
        }
      }
    });

    this.setupPolly();

    exitSignals.forEach(signal => process.on(signal, this.saveRecordings.bind(this)));
  }
  async start() {
    this.logger.info('Pollyjs Has Started');
    polly.replay();
  }

  setupPolly() {
    // const { server } = this.polly;

    // server.any().on('beforePersist', (req, recording) => {
    //   recording.request.headers = recording.request.headers.filter(header => header.name !== 'cookie')
    // });
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
