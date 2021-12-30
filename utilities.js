const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;

//All credits for the variable(Class) 'Future' to Marcel Metz on the freon gnome extension project

var Future = GObject.registerClass({
    GTypeName: 'Future',
}, class Future extends GObject.Object {
	_init(argv, callback) {
        try{
            this._callback = callback;
            let [exit, pid, stdin, stdout, stderr] =
                GLib.spawn_async_with_pipes(null, /* cwd */
                                            argv, /* args */
                                            null, /* env */
                                            GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                                            null /* child_setup */);
            this._stdout = new Gio.UnixInputStream({fd: stdout, close_fd: true});
            this._dataStdout = new Gio.DataInputStream({base_stream: this._stdout});
            new Gio.UnixOutputStream({fd: stdin, close_fd: true}).close(null);
            new Gio.UnixInputStream({fd: stderr, close_fd: true}).close(null);

            this._childWatch = GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status, requestObj) => {
                GLib.source_remove(this._childWatch);
            });

            this._readStdout();
        } catch(e){
            global.log(e.toString());
        }
    }

    _readStdout(){
        this._dataStdout.fill_async(-1, GLib.PRIORITY_DEFAULT, null, (stream, result) =>{
            if (stream.fill_finish(result) == 0){
                try{
                    this._callback(stream.peek_buffer().toString());
                }catch(e){
                    global.log(e.toString());
                }
                this._stdout.close(null);
                return;
            }

            stream.set_buffer_size(2 * stream.get_buffer_size());
            this._readStdout();
        });
    }
});

