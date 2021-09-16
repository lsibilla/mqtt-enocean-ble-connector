const EventEmitter = require('events');
const winston = require('./logger');


const Config = require('./config');
const Device = require('./device');
const Mqtt = require('./mqtt');
const Ble = require('./ble');

const config = Config.read('./config.yml')

const mqttClient = Mqtt.createClient(config.mqtt.url);

config.devices.forEach(device => {
  var bleEventEmitter = new EventEmitter();

  winston.info(`Subscribing to Enocean device ${device.name}...`);
  Ble.createDevice(device.commissionData,
                   bleEventEmitter)

  device.buttons.forEach(button => {
    const mqttEventEmitter = new EventEmitter();
    
    switch (device.type) {
      case 'switch':
        mqttClient.createDevice(`${device.name} button ${button}`,
                                `${config.mqtt.discoveryTopic}/${device.type}/${device.id}_${button}/config`, 
                                `${config.mqtt.deviceTopic}/${device.id}_${button}/state`,
                                `${config.mqtt.deviceTopic}/${device.id}_${button}/state/set`,
                                mqttEventEmitter);
        Device.createSwitch(device.name,
                            button,
                            mqttEventEmitter,
                            bleEventEmitter);
        break;
      default:
        winston.error(`Unknown device type '${device.type}' for device ${device.name} (${device.id})`);
    }
  })
})

Ble.start();
