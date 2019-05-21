const { Polly } = require('@pollyjs/core');
const HttpAdapter = require('@pollyjs/adapter-node-http');
const FsStoragePersister = require('@pollyjs/persister-fs');
const path = require('path');

const exitSignals = ['SIGTERM', 'SIGINT'];

const createPolly = () => {
  Polly.register(HttpAdapter);
  Polly.register(FsStoragePersister);

  const polly = new Polly('NanoMixtape', {
    adapters: ['node-http'],
    persister: 'fs',
    mode: 'replay',
    recordIfMissing: true,
    persisterOptions: {
      fs: {
        recordingsDir: path.join(process.cwd(), 'project/config/recordings')
      }
    }
  });

  polly.replay();

  const saveRecordings = async () => {
    console.log("Saving recordings");
    await polly.stop(); // Saves the recordings

    exitSignals.forEach(signal => process.removeListener(signal, saveRecordings));
  };

  exitSignals.forEach(signal => process.on(signal, saveRecordings));
};

const start = async function() {
    createPolly();
};

class MockServer {
  async start() {
    start();
  }

  async stop() {
    return new Promise(resolve => {
      console.log("Stropping server");
      if (config.server && config.server.close) {
        config.server.close(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  config() {
    return config;
  }
}

module.exports = MockServer;
