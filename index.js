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
  // console.log(`📥 Client connected: ${client.id}`);
});

broker.on('clientDisconnect', (client) => {
  // console.log(`📤 Client disconnected: ${client.id}`);
});

broker.on('publish', async (packet, client) => {
  if (client) {
    const topicParts = packet.topic.split('/');

    // Enforce username and password for publishing
    // if (!client || !client.connDetails || !client.connDetails.username || !client.connDetails.password) {
    //   return console.error('Publish denied: Username and password required');
    // }
    // if (client.connDetails.username !== username || client.connDetails.password !== password) {
    //   return console.error('Publish denied: Invalid username or password');
    // }

    // console.error('Req parts ------>>>>>: ' + packet.topic + ' - ' + packet.payload.toString());

    const sensorName = topicParts[1];   // For shellies/0001-01-07-005-02-001-004-01-001/status
    const type = topicParts[2];   // For shellies/0001-01-07-005-02-001-004-01-001/status
    let sensorValue = 'false';
    if (type === 'status') {
      sensorValue = JSON.parse(packet.payload).motion.toString();
    } else if (type === 'info') {
      sensorValue = JSON.parse(packet.payload).sensor.motion.toString();
    }

    // if (username != userPart || password != passwordPart) return console.error('Invalid username or password');
    // if (!topicParts || !passwordPart || !sensorName || !sensorValue) return console.error('Invalid topic format');

    const timeNow = new Date().toISOString();
    const data = await new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('all_topic', packet.topic);
      formData.append('data', packet.payload.toString());
      formData.append('sensor_name', sensorName);
      formData.append('sensor_value', sensorValue);
      axios.post(`http://${HOST}/accept_mqtt_post`, formData, {
          headers: formData.getHeaders(), // Include appropriate headers for formData
      })
      .then(response => resolve(`Successfull: ${timeNow}`))
      .catch(error => resolve(`Error: ${timeNow}`));
    });

    console.log(`📤 Data posted to web endpoint: ${data}`);
    if (!fs.existsSync('responses.txt')) {
      fs.writeFileSync('responses.txt', '', 'utf8'); // Create the file if it doesn't exist
    }

    // Write data to responses.txt
    try {
      fs.appendFileSync('responses.txt', `${data}\n`, 'utf8');
      console.log('Data successfully written to responses.txt');
    } catch (err) {
      console.error('Error writing to responses.txt:', err);
    }
  }
});
