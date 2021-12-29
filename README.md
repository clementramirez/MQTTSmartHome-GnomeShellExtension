# MQTTSmartHome-GnomeShellExtension

Gnome Shell Extension to interact with a SmartHome with MQTT protocol

![Screenshot](http://i.ibb.co/bXQ47zb/Extension-Image-Example.png)

# Install
### From Gnome-Shell Extension Website
Go to 
### From this GitHub Repo
Follow these steps :
```sh
$ mkdir -p ~/.local/share/gnome-shell/extensions
$ git clone https://github.com/DiyVE/MQTTSmartHome-GnomeShellExtension.git ~/.local/share/gnome-shell/extensions/ramirez.clement3@gmail.com
$ gnome-extensions enable ramirez.clement3@gmail.com
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
# Contacts
- ramirez.clement3@gmail.com
