const mqtt = require('mqtt');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


// MQTT-Broker verbinden
const client = mqtt.connect('mqtt://localhost'); // Replace 'broker-url' with your broker's address

client.on('connect', function () {
  console.log('Connected to MQTT Broker');
  // Subscribe to all topics using the '#' wildcard
  client.subscribe('#', function (err) {
    if (!err) {
      console.log('Successfully subscribed to all topics');
    }
  });
});

// Handle incoming messages
client.on('message', function (topic, message) {
    // Split the topic into parts based on '/'
    const topicParts = topic.split('/');  

    const userPart = topicParts[1];   // For 'mqtt/usernu425/1212323/topic3', userPart would be 'usernu425'
    const passwordPart = topicParts[2];   // For 'mqtt/usernu425/1212323/topic3', passwordPart would be '1212323'
    const topicPart = topicParts[3];  // For 'mqtt/usernu425/1212323/topic3', topicPart would be 'topic3'

    console.log('Received message on topic:', topic);
    console.log('User part:', userPart);
    console.log('Password part:', passwordPart);
    console.log('Topic part:', topicPart);
    if (!topicParts || !passwordPart || !topicPart) return console.error('Invalid topic format');

    // Example: HTTP POST to a web endpoint
    const formData = new FormData();
    formData.append('all_topic', topic);
    formData.append('data', message.toString());
    formData.append('user', userPart);
    formData.append('password', passwordPart);
    formData.append('topic', topicPart);
    axios.post('http://159.69.194.65/accept_mqtt_post', formData, {
        headers: formData.getHeaders(), // Include appropriate headers for formData
    })
    .then(response => {
        console.log('Successfully posted data to web endpoint', response.data);
    })
    .catch(error => {
        console.error('Error posting data to web endpoint:', error);
    });
});

// on error create a log file in the same directory and write the error message
client.on('error', function (error) {
    fs.writeFile('error.log', error.message, function (err) {
        if (err) return console.error('Error writing error log:', err);
        console.log('Error log created');
    });
});