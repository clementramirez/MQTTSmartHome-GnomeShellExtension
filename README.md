# MQTTSmartHome-GnomeShellExtension

Gnome Shell Extension to interact with a SmartHome with MQTT protocol

![Screenshot](http://i.ibb.co/bXQ47zb/Extension-Image-Example.png)

# Install
### From Gnome-Shell Extension Website
Go to https://extensions.gnome.org/extension/4715/smarthome-control/
### From this GitHub Repo
Follow these steps :
```sh
$ mkdir -p ~/.local/share/gnome-shell/extensions
$ git clone https://github.com/DiyVE/MQTTSmartHome-GnomeShellExtension.git ~/.local/share/gnome-shell/extensions/mqttsmarthomecontrol@ramirez.clement3gmail.com
$ gnome-extensions enable mqttsmarthomecontrol@ramirez.clement3gmail.com
```
# Configure the extension
All devices are declared and configured into the devices.json file.
An example of device configuration below :
```json
[
  {
    "name": <name of your device>
    "type": <types of device>
    "hostname": <mqtt server hostname>
    "topic": <topic name for the device>
  },
  {
    <same declaration for another device...>
  }
]
```
For now only 2 types of devices are available, outlets and lights.
The parameters needs to be strings.
# Things to do
- [x] All devices are configurable by a json file
- [ ] Add the possibility to change the configuration of devices directly on a graphic interface
- [ ] Add new types of devices
- [ ] Add luminosity and color configuration for lights
# Contacts
- ramirez.clement3@gmail.com
