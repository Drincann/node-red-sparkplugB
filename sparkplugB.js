const sparkplugB = require('sparkplug-payload').get("spBv1.0");
const sparkplugClient = require('sparkplug-client');

module.exports = function (RED) {
  // 设备列表，存储所有使用过的 devicdId，用于 publish birth messagg
  const deviceSet = new Set();

  function SparkPlubB(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.warn('构造调用√');
    const { serverUrl, username, password,
      groupId, edgeNode, clientId } = config;

    try {
      var client = sparkplugClient.newClient({
        serverUrl, username, password,
        groupId, edgeNode, clientId,
      });
    } catch (e) {
      node.error('创建 sparkplug 客户端失败!')
      node.error(e.message)
    }

    // 状态样式
    client.on('close', () => this.status({ fill: "red", shape: "ring", text: "已断开连接" }))
    client.on('connect', () => this.status({ fill: "green", shape: "dot", text: "已连接" }))
    client.on('reconnect', () => this.status({ fill: "yellow", shape: "ring", text: "正在连接..." }))

    // 发布 birth 消息
    client.on('birth', () => {
      node.log('收到 birth 事件');
      deviceSet.forEach(deviceId => {
        sparkplugClient.publishDeviceBirth(deviceId, { timestamp: Date.now() });
        node.log(`发布了设备 ${deviceId} 的 device birth 消息`)
      });
    });

    // device command 消息回调，output
    client.on('dcmd', (deviceId, payload) => {
      node.log(`收到来自设备 ${deviceId} 的 dcmd 事件`);

      let msg = { deviceId, messageType: 'DCMD', payload };
      node.send(msg);
    });

    // 发送 ddata ddeath dbirth 消息，input
    node.on('input', function (msg) {
      const { diviceId, messageType, payload } = msg;
      if (messageType == 'DDATA') {
        client.publishDeviceData(deviceId, payload);
        node.log(`发布了设备 ${deviceId} 的 device data 消息`)
      } else if (messageType == 'DBIRTH') {
        if (!deviceSet.has(deviceId)) {
          deviceSet.add(deviceId);
          client.publishDeviceBirth(deviceId, payload);
          node.log(`发布了设备 ${deviceId} 的 device birth 消息`)
        }
      } else if (messageType == 'DDEATH') {
        deviceSet.delete(diviceId);
      }
    });

    node.on('close', () => {
      client.stop();
    });
  }
  RED.nodes.registerType("sparkplugB", SparkPlubB);
}