## MQTT NODEJS

This backend application (MQTT server) can receive requests from this mobile Android/Ios app:

```bash
https://owntracks.org
```

OwnTracks is an app that broadcasts location from the phone even when the application on the phone(OwnTracks app) is closed.
OwnTracks app is free to use.

// to check what processes are running just in case you want to stop any
```bash
ps aux | grep npm
```
// to terminate process just in case you want to stop any
```bash
kill <PID>
```
// npm start so it doesn't stop after closing terminal
```bash
nohup npm start > output.log 2>&1 & disown
```