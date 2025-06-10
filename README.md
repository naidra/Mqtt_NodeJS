## MQTT NODEJS

This backend application (MQTT server) can receive requests from this mobile Android/Ios app:

```bash
https://owntracks.org
```

OwnTracks is an app that broadcasts location from the phone even when the application on the phone(OwnTracks app) is closed.
OwnTracks app is free to use.

To check what processes are running just in case you want to stop any
```bash
ps aux | grep npm
```
To terminate process just in case you want to stop any
```bash
kill <PID>
```
npm start so it doesn't stop after closing terminal
```bash
nohup npm start > output.log 2>&1 & disown
```
The url to mqtt server should look like this
```bash
mqtt/usernu425/1212323/0003-23-42-432-002-001/on
```