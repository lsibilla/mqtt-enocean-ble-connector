const winston = require('winston');
const validator = require('validator');

const createDevice = (name, mqttEventEmitter, bleEventEmitter, onMqttReceive, onBleTelegram) => {
  mqttEventEmitter.on('receive', onMqttReceive)
  bleEventEmitter.on('telegram', onBleTelegram)

  return {}
}

module.exports = {
  createDevice: createDevice,
  
  createSwitch: (name,
                  button,
                  mqttEventEmitter,
                  bleEventEmitter,
                  mqttOnValue = 'true',
                  mqttOffValue = 'false') => {

    var onMqttReceive = (data) => {}
    var onBleTelegram = (telegram) => {
      if (telegram.authenticated && 
          !telegram.replayed && 
          telegram.data) {
        if (telegram.data.button == button) {
          winston.info(`Device '${name}' button ${telegram.data.button} passed to ${telegram.data.pressed}.`)
          mqttEventEmitter.emit('send', telegram.data.pressed ? mqttOnValue : mqttOffValue);
        }
      } else {
        winston.warning(`Device '${name}' received inconsistent telegram:`)
        winston.info(telegram)
      }
    }

    return createDevice(name, mqttEventEmitter, bleEventEmitter, onMqttReceive, onBleTelegram);
  }
}
