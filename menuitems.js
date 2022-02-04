const St = imports.gi.St;
const Gio = imports.gi.Gio;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;

const Utilities = Me.imports.utilities;

var SensorMenuItem = GObject.registerClass(
    class SensorMenuItem extends PopupMenu.PopupImageMenuItem {
        _init(displayedName, topic, host, sensorLogo, sensorSuffix) {

            // Initialize Properties
            this.displayedName = displayedName;
            this.topic = topic;
            this.host = host;
            this.sensorLogo = sensorLogo;
            this.sensorSuffix = sensorSuffix;

            super._init(this.displayedName, 'network-wireless-disabled-symbolic');

            // Add Value Label
            this._valueLabel = new St.Label({ text: "OFFLINE", style_class: "offline-device-label" });
            this._valueLabel.set_x_align(Clutter.ActorAlign.END);
            this._valueLabel.set_x_expand(true);
            this._valueLabel.set_y_expand(true);
            this.add(this._valueLabel);
            
    }
    update(PopupMenuItem) {
        let commandPath = GLib.find_program_in_path('mosquitto_sub');
        let dataFuture = new Utilities.Future([commandPath, '-W', '1', '-h', this.host,'-t', this.topic], (stdata) => {
            if (stdata == "")
            {
                PopupMenuItem.setSensitive(false);
                this.setIcon('network-wireless-disabled-symbolic');
                this._valueLabel.text = "OFFLINE";
                this._valueLabel.style_class = "offline-device-label";
            }
            else
            {
                PopupMenuItem.setSensitive(true);
                this.setIcon(this.sensorLogo);
                this._valueLabel.style_class = "on-device-label";
                this._valueLabel.text = stdata + this.sensorSuffix;
            }
        });
    }
});

var TempSensorMenuItem = GObject.registerClass(
    class TempSensorMenuItem extends SensorMenuItem {
        _init(displayedName, topic, host) {
            super._init(displayedName, topic, host, new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/sensors_icon.png')}), '°C');
        }
    }
);

var HumSensorMenuItem = GObject.registerClass(
    class HumSensorMenuItem extends SensorMenuItem {
        _init(displayedName, topic, host) {
            super._init(displayedName, topic, host, new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/icons8-hygrometer-48.png')}), '%');
        }
    }
);

var DeviceMenuItem = GObject.registerClass(
  class DeviceMenuItem extends PopupMenu.PopupImageMenuItem {

    _init(displayedName, topic, host, onIcon, offIcon) {

        // Initialize Properties
        this.onIcon = onIcon;
        this.offIcon = offIcon;
        this.displayedName = displayedName;
        this.topic = topic;
        this.host = host;
        this._state = true;

        super._init(this.displayedName, 'network-wireless-disabled-symbolic');

        // Add State Label
        this._stateLabel = new St.Label({ text: "OFFLINE", style_class: "offline-device-label" });
        this._stateLabel.set_x_align(Clutter.ActorAlign.END);
        this._stateLabel.set_x_expand(true);
        this._stateLabel.set_y_expand(true);
        this.add(this._stateLabel);

        this.connect('activate', () => {
            if (this._state) {
                this._state = false;
            }
            else {
                this._state = true;
            }
            this.state(this._state);
        });
    }

    state(state) {
        if (state) {
            GLib.spawn_command_line_async(`mosquitto_pub -r -h ${this.host} -t ${this.topic} -m true`);
        }
        else {
            GLib.spawn_command_line_async(`mosquitto_pub -r -h ${this.host} -t ${this.topic} -m false`);
        }
    }

    //Update the state of the device asynchronously and update labels, icons accordingly
    update(PopupMenuItem) {
        let commandPath = GLib.find_program_in_path('mosquitto_sub');
        let dataFuture = new Utilities.Future([commandPath, '-W', '1', '-h', this.host,'-t', this.topic], (stdata) => {
            if (stdata == "")
            {
                PopupMenuItem.setSensitive(false);
                this.setIcon('network-wireless-disabled-symbolic');
                this._stateLabel.text = "OFFLINE";
                this._stateLabel.style_class = "offline-device-label";
            }
            else
            {
                PopupMenuItem.setSensitive(true);
                if (stdata.includes("true")) {
                    this._stateLabel.text = "ON";
                    this._stateLabel.style_class = "on-device-label";
                    this.setIcon(this.onIcon);
                    this._state = true;
                }
                else {
                    this._stateLabel.text = "OFF";
                    this._stateLabel.style_class = "off-device-label";
                    this.setIcon(this.offIcon);
                    this._state = false;
                }
            }
        });
    }
});

var LampMenuItem = GObject.registerClass(
    class LampMenuItem extends DeviceMenuItem {
        _init(displayedName, topic, host) {
            super._init(displayedName, topic, host, new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/lighton.png')}), new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/lightoff.png')}));
        }
    }
);

var OutletMenuItem = GObject.registerClass(
    class OutletMenuItem extends DeviceMenuItem {
        _init(displayedName, topic, host) {
            super._init(displayedName, topic, host, new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/socketoff.png')}), new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/socketoff.png')}));
        }
    }
);

var KettleMenuItem = GObject.registerClass(
    class KettleMenuItem extends DeviceMenuItem {
        _init(displayedName, topic, host) {
            super._init(displayedName, topic, host, new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/kettle.png')}), new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/kettle.png')}));
        }
    }
);
