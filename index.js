const mqtt = require('mqtt');
const axios = require('axios');
const FormData = require('form-data');


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

    // Extract parts of the topic (e.g., 'topic3' and 'user3')
    const userPart = topicParts[1];   // For 'dein/mqtt/topic3/user3', userPart would be 'user3'
    const topicPart = topicParts[2];  // For 'dein/mqtt/topic3/user3', topicPart would be 'topic3'

    console.log('Received message on topic:', topic);
    console.log('Topic part:', topicPart);
    console.log('User part:', userPart);

    // Example: HTTP POST to a web endpoint
    const formData = new FormData();
    formData.append('all_topic', topic);
    formData.append('data', message.toString());
    formData.append('user', userPart);
    formData.append('topic', topicPart);
    axios.post('http://162.55.52.183/accept_mqtt_post', formData, {
        headers: formData.getHeaders(), // Include appropriate headers for formData
    })
    .then(response => {
        console.log('Successfully posted data to web endpoint', response.data);
    })
    .catch(error => {
        console.error('Error posting data to web endpoint:', error);
    });
});