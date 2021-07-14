# 用于 node-red 的 sparkplug B 规范 MQTT client 节点

## install

clone 该项目于 `${location}`

```sh
cd ~/node-red ; npm install ${location}
```

## usage

### 连接

配置节点部署后自动链接，`username` 、`password` 缺省为空串。

### 发送消息

input msg object 中需要三个属性:

- `deviceId` -> 设备 id
  > 在 sparkplug B 规范中，deviceId 将被拼接到 MQTT topic 的最后。
  
- `messageType` -> 暂时仅支持 `DDATA` `DBIRTH` `DDEATH`

- `payload` -> 数据

### 接收消息

暂时仅支持接收 `DCMD` 消息

在 output msg object 下有两个属性:

- `deviceId` -> 设备 id

- `messageType` -> 暂时仅支持 `DCMD`

- `payload` -> 数据

## 缓存

通过 input msg object 发送的 `DBIRTH` 消息将被缓存，部署后将自动对所有历史发布过 `DBIRTH` 的设备统一发布 `DBIRTH` 消息。
