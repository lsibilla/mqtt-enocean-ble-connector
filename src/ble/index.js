const EnoceanBle = require('node-enocean-ble');
const winston = require('winston');

var enocean = new EnoceanBle();

module.exports = {
  createDevice: function(commissionData, eventEmitter) {
    const device = enocean.commission(commissionData);
    
    // Set a callback for incoming telegrams
    enocean.ondata = (telegram) => {
      if (telegram.address == device.address)
        eventEmitter.emit('telegram', telegram);
    }

    return device;
  },

  start: function() {
    // Start to monitor telegrams
    winston.info('Start listening Enocean Ble telegrams...');
    enocean.start().then(() => {
      // Successfully started to monitor telegrams
      winston.info('Listening Enocean Ble telegrams...');
    }).catch((error) => {
      // Failed to start to monitor telegrams
      winston.error(error);
    });
  }
}
