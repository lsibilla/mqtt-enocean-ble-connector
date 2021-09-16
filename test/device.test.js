const EventEmitter = require('events');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const winston = require('./logger');

const Device = require('../src/device');

describe("Device", () => {
  test('Create custom device', () => {
    const mqttEventEmitter = new EventEmitter();
    const bleEventEmitter = new EventEmitter();
    
    const onMqttReceive = jest.fn();
    const onBleTelegram = jest.fn();

    Device.createDevice('test',
                        mqttEventEmitter,
                        bleEventEmitter,
                        onMqttReceive,
                        onBleTelegram
    );

    mqttEventEmitter.emit('receive', 'testData')
    expect(onMqttReceive).toBeCalledWith('testData');
    
    bleEventEmitter.emit('telegram', 'testData')
    expect(onBleTelegram).toBeCalledWith('testData');
  });

  test('Create switch device', () => {
    const mqttSendMock = jest.fn();
    const bleSendMock = jest.fn();
    const mqttEventEmitter = new EventEmitter();
    const bleEventEmitter = new EventEmitter();
    
    mqttEventEmitter.on('send', mqttSendMock);
    bleEventEmitter.on('telegram', bleSendMock);

    const mqttOnValue = 'true';
    const mqttOffValue = 'false';
    const button = 'A1'
    const onTelegram = {
      authenticated: true,
      replayed: false,
      data: {
        button: button,
        pressed: true
      }
    }
    const offTelegram = {
      authenticated: true,
      replayed: false,
      data: {
        button: button,
        pressed: false
      }
    }

    Device.createSwitch('test',
                        button,
                        mqttEventEmitter,
                        bleEventEmitter,
                        mqttOnValue,
                        mqttOffValue
    );

    bleEventEmitter.emit('telegram', onTelegram)
    expect(mqttSendMock).toBeCalledWith(mqttOnValue);
    
    bleEventEmitter.emit('telegram', offTelegram)
    expect(mqttSendMock).toBeCalledWith(mqttOffValue);
  })
  
  test('Create switch device with custom MQTT values', () => {
    const mqttSendMock = jest.fn();
    const bleSendMock = jest.fn();
    const mqttEventEmitter = new EventEmitter();
    const bleEventEmitter = new EventEmitter();
    
    mqttEventEmitter.on('send', mqttSendMock);
    bleEventEmitter.on('send', bleSendMock);

    const mqttOnValue = '1';
    const mqttOffValue = '0';
    const button = 'A1'
    const onTelegram = {
      authenticated: true,
      replayed: false,
      data: {
        button: button,
        pressed: true
      }
    }
    const offTelegram = {
      authenticated: true,
      replayed: false,
      data: {
        button: button,
        pressed: false
      }
    }

    Device.createSwitch('test',
                        button,
                        mqttEventEmitter,
                        bleEventEmitter,
                        mqttOnValue,
                        mqttOffValue
    );

    bleEventEmitter.emit('telegram', onTelegram)
    expect(mqttSendMock).toBeCalledWith(mqttOnValue);
    
    bleEventEmitter.emit('telegram', offTelegram)
    expect(mqttSendMock).toBeCalledWith(mqttOffValue);
  })
});