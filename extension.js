const St = imports.gi.St;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

const MenuItems = Me.imports.menuitems;

class Extension {
    constructor() {
        this._indicator = null;
    }

    // Enable the extension
    enable() {
        log(`enabling ${Me.metadata.name}`);

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.5, indicatorName, false);

        // Create a list that contains all devices
        var devices = [];

        //Connect _indicator to update devices on button press
        this._indicator.connect('button-press-event' , function() {
            for (const device of devices) {
                device.update(device);
            }

        });
            
        // Add an icon
        let fileicon = new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/SmartHome.png')});
        let icon = new St.Icon({
            gicon: fileicon,
            icon_size: 16,
            style_class: "system-status-icon"
        });
        this._indicator.add_child(icon);

        // Add Lights Panel
        let lightsSubmenu = new PopupMenu.PopupSubMenuMenuItem("Lights Control", true);
        lightsSubmenu.icon.set_gicon(new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/lighton.png')}));
        this._indicator.menu.addMenuItem(lightsSubmenu);

        // Add Outlets Panel
        let outletsSubmenu = new PopupMenu.PopupSubMenuMenuItem("Outlets Control", true);
        outletsSubmenu.icon.set_gicon(new Gio.FileIcon({file: Gio.File.new_for_path(Me.path + '/icons/socketoff.png')}));
        this._indicator.menu.addMenuItem(outletsSubmenu);

        // Parse the JSON file and add devices to the list
        try
        {
            let fileContents = String(GLib.file_get_contents(Me.path + '/devices.json')[1]);
            let raw_json = JSON.parse(fileContents);
            for (let i = 0; i < raw_json.length; i++) {
                if (raw_json[i].type == "light") {
                    devices.push(new MenuItems.LampMenuItem(raw_json[i].name, raw_json[i].topic, raw_json[i].hostname));
                    lightsSubmenu.menu.addMenuItem(devices[i]);
                }
                else if (raw_json[i].type == "outlet") {
                    devices.push(new MenuItems.OutletMenuItem(raw_json[i].name, raw_json[i].topic, raw_json[i].hostname));
                    outletsSubmenu.menu.addMenuItem(devices[i]);
                }
            }
        }
        catch(e)
        {
            logError(e);
        }

        // Add the _indicator to the panel
        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }
    
    // Disable the extension
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}
