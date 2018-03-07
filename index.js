const process = require('process')
const mqtt = require('mqtt')

const vMqttServer =  process.env.mqttServer || 'mqtt://127.0.0.1'
const vMqttUserAuthentication = {username:process.env.mqttUserName,password:process.env.mqttUserPassword}
const connectedClient = ()=>{
  return new Promise((resolve,reject)=>{
    const client  = mqtt.connect(vMqttServer,vMqttUserAuthentication)
    client.on('connect', function (data,error) {
      return resolve(client)
    })
    client.on('error',(err)=>{
      console.log(err)
      return reject(err)
    })
  })
}
const subscribe = (client,aTopic)=>{
  return new Promise((resolve,reject)=>{
    client.subscribe(aTopic,(error,data)=>{
      if(error) return reject(error)
      return resolve(data)
    })
  })

}
const main = async ()=>{
  let client = await connectedClient()
  await subscribe(client,'user/#')
  client.on('message', function (topic, message) {
    console.log(topic,message.toString())
  })
  // publish is callback function using async-mqtt will be better
  // topic is the topic to publish to, String
  // message is the message to publish, Buffer or String
  // options is the options to publish with, including:
  // qos QoS level, Number, default 0
  //   QoS 0 : received at most once : The packet is sent, and that's it. There is no validation about whether it has been received.
  //   QoS 1 : received at least once : The packet is sent and stored as long as the client has not received a confirmation from the server. MQTT ensures that it will be received, but there can be duplicates.
  //   QoS 2 : received exactly once : Same as QoS 1 but there is no duplicates.
  //   About data consumption, obviously, QoS 2 > QoS 1 > QoS 0, if that's a concern to you.
  // retain retain flag, Boolean, default false
  // dup mark as duplicate flag, Boolean, default false
  // callback - function (err), fired when the QoS handling completes, or at the next tick if QoS 0. An error occurs if client is disconnecting.
  client.publish('user/message', 'Hello mqtt')
  
}
main()