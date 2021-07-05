const sparkplugB = require('sparkplug-payload').get("spBv1.0");;
module.exports = function (RED) {
    function SparkPlubB(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            msg.payload = sparkplugB.encodePayload(msg.payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("sparkplugB", SparkPlubB);
}