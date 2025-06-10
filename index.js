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
const { MQTT_USERNAME: username, MQTT_PASSWORD: password } =  process.env;

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
    // console.log(`📨 Message from ${client.id}: ${packet.payload.toString()} on topic ${packet.topic}`);

    // if (!fs.existsSync('responses.txt')) {
    //     fs.writeFileSync('responses.txt', '', 'utf8');
    // }

    // fs.appendFileSync('responses.txt', `Topic: ${packet.topic}\nMessage: ${packet.payload.toString()}\n\n`, 'utf8');

    const topicParts = packet.topic.split('/');
    console.log(`📨 Message from ${client.id}: ${packet.payload.toString()} on topic ${packet.topic}`);

    if (topicParts.length < 5) return console.error('Invalid topic format. Expected at least 5 parts.');

    const userPart = topicParts[1];   // For 'mqtt/usernu425/1212323/0003-23-42-432-002-001/on', userPart would be 'usernu425'
    const passwordPart = topicParts[2];   // For 'mqtt/usernu425/1212323/0003-23-42-432-002-001/on', passwordPart would be '1212323'
    const sensorName = topicParts[3];  // For 'mqtt/usernu425/1212323/0003-23-42-432-002-001/on', topicPart would be 'topic3'
    const sensorValue = topicParts[4];  // For 'mqtt/usernu425/1212323/0003-23-42-432-002-001/on', topicPart would be 'topic3'

    if (username != userPart || password != passwordPart) return console.error('Invalid username or password');
    if (!topicParts || !passwordPart || !sensorName || !sensorValue) return console.error('Invalid topic format');

    const formData = new FormData();
    formData.append('all_topic', packet.topic);
    formData.append('data', packet.payload.toString());
    formData.append('user', userPart);
    formData.append('password', passwordPart);
    formData.append('sensor_name', sensorName);
    formData.append('sensor_value', sensorValue);
    axios.post(`http://${HOST}/accept_mqtt_post`, formData, {
        headers: formData.getHeaders(), // Include appropriate headers for formData
    })
    .then(response => {
        console.log('Successfully posted data to web endpoint', response.data);
    })
    .catch(error => {
        console.error('Error posting data to web endpoint:', error);
    });
  }
});
