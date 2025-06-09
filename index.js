// import mqtt from 'mqtt';
// import axios from 'axios';
// import FormData from 'form-data';
// import fs from 'fs';
// import dotenv from 'dotenv'; // Load environment variables from .env file
// dotenv.config();

// const { USERNAME: username, PASSWORD: password } =  process.env;

// // MQTT-Broker verbinden
// const client = mqtt.connect('mqtt://82.29.177.62:1883'); // for server
// // const client = mqtt.connect('mqtt://broker.hivemq.com'); // for public broker
// // const client = mqtt.connect('mqtt://test.mosquitto.org'); // for public broker
// // const client = mqtt.connect('mqtt://broker.emqx.io'); // for public broker
// // const client = mqtt.connect('mqtt://localhost'); // Replace 'broker-url' with your broker's address

// client.on('connect', function () {
//   console.log('Connected to MQTT Broker');
//   // Subscribe to all topics using the '#' wildcard
//   client.subscribe('#', function (err) {
//     if (!err) {
//       console.log('Successfully subscribed to all topics');
//     }
//   });
// });

// // Handle incoming messages
// client.on('message', function (topic, message) {
//     const topicParts = topic.split('/');

//     console.log(`Topic: ${topic}\nMessage: ${message.toString()}\n\n`);
    
//     // if (!fs.existsSync('responses.txt')) {
//     //     fs.writeFileSync('responses.txt', '', 'utf8');
//     // }

//     // fs.appendFileSync('responses.txt', `Topic: ${topic}\nMessage: ${message.toString()}\n\n`, 'utf8');
    

//     const userPart = topicParts[1];   // For 'mqtt/usernu425/1212323/topic3', userPart would be 'usernu425'
//     const passwordPart = topicParts[2];   // For 'mqtt/usernu425/1212323/topic3', passwordPart would be '1212323'
//     const topicPart = topicParts[3];  // For 'mqtt/usernu425/1212323/topic3', topicPart would be 'topic3'

//     // console.log('Received message on topic:', topic);
//     // console.log('User part:', userPart);
//     // console.log('Password part:', passwordPart);
//     // console.log('Topic part:', topicPart);
//     // if (!topicParts || !passwordPart || !topicPart) return console.error('Invalid topic format');

//     // Example: HTTP POST to a web endpoint
//     // const formData = new FormData();
//     // formData.append('all_topic', topic);
//     // formData.append('data', message.toString());
//     // formData.append('user', userPart);
//     // formData.append('password', passwordPart);
//     // formData.append('topic', topicPart);
//     // axios.post('http://159.69.194.65/accept_mqtt_post', formData, {
//     //     headers: formData.getHeaders(), // Include appropriate headers for formData
//     // })
//     // .then(response => {
//     //     console.log('Successfully posted data to web endpoint', response.data);
//     // })
//     // .catch(error => {
//     //     console.error('Error posting data to web endpoint:', error);
//     // });
// });

// // on error create a log file in the same directory and write the error message
// client.on('error', function (error) {
//   console.log('MQTT Client Error:', error);
//   fs.writeFile('error.log', error.message, function (err) {
//       if (err) return console.error('Error writing error log:', err);
//       console.log('Error log created');
//   });
// });


import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv'; // Load environment variables from .env file
dotenv.config();
import aedes from 'aedes';
import net from 'net';

const broker = aedes();
const PORT = 1883;
const HOST = '82.29.177.62'; // Bind to this IP

const server = net.createServer(broker.handle);

server.listen(PORT, HOST, () => {
  console.log(`🟢 MQTT broker started and listening on ${HOST}:${PORT}`);
});

broker.on('client', (client) => {
  console.log(`📥 Client connected: ${client.id}`);
});

broker.on('clientDisconnect', (client) => {
  console.log(`📤 Client disconnected: ${client.id}`);
});

broker.on('publish', (packet, client) => {
  if (client) {
    console.log(`📨 Message from ${client.id}: ${packet.payload.toString()} on topic ${packet.topic}`);

    if (!fs.existsSync('responses.txt')) {
        fs.writeFileSync('responses.txt', '', 'utf8');
    }

    fs.appendFileSync('responses.txt', `Topic: ${packet.topic}\nMessage: ${packet.payload.toString()}\n\n`, 'utf8');
    

    // const userPart = topicParts[1];   // For 'mqtt/usernu425/1212323/topic3', userPart would be 'usernu425'
    // const passwordPart = topicParts[2];   // For 'mqtt/usernu425/1212323/topic3', passwordPart would be '1212323'
    // const topicPart = topicParts[3];  // For 'mqtt/usernu425/1212323/topic3', topicPart would be 'topic3'

    // console.log('Received message on topic:', topic);
    // console.log('User part:', userPart);
    // console.log('Password part:', passwordPart);
    // console.log('Topic part:', topicPart);
    // if (!topicParts || !passwordPart || !topicPart) return console.error('Invalid topic format');

    // Example: HTTP POST to a web endpoint
    // const formData = new FormData();
    // formData.append('all_topic', topic);
    // formData.append('data', message.toString());
    // formData.append('user', userPart);
    // formData.append('password', passwordPart);
    // formData.append('topic', topicPart);
    // axios.post('http://159.69.194.65/accept_mqtt_post', formData, {
    //     headers: formData.getHeaders(), // Include appropriate headers for formData
    // })
    // .then(response => {
    //     console.log('Successfully posted data to web endpoint', response.data);
    // })
    // .catch(error => {
    //     console.error('Error posting data to web endpoint:', error);
    // });
  }
});
