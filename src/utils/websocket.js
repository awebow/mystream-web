export default class {

    constructor(url) {
        this.socket = new WebSocket(url);
        this.listens = new Map();

        this.socket.onmessage = e => {
            e.data.arrayBuffer().then(buffer => {
                var view = new DataView(buffer);
                var decoder = new TextDecoder();

                console.log(buffer);
                if(view.getUint8(0) == 1) {
                    var event;
                    for(var i = 1; i < view.byteLength; i++) {
                        if(view.getUint8(i) == 0) {
                            event = decoder.decode(buffer.slice(1, i));
                            break;
                        }
                    }

                    console.log(event);
                    if(this.listens.has(event)) {
                        console.log(decoder.decode(buffer.slice(event.length + 2)));
                        var data = JSON.parse(decoder.decode(buffer.slice(event.length + 2)));
                        this.listens.get(event)(data)
                    }
                }
            });
        };
    }

    join(path) {
        this.socket.send(JSON.stringify({cmd: "join", data: path}));
    }

    emit(event, data) {
        var encoder = new TextEncoder();
        var eventBytes = encoder.encode(event);
        var json = new TextEncoder().encode(JSON.stringify(data));
        
        var arr = new Uint8Array(eventBytes.length + json.length + 2);
        arr[0] = 1;
        arr.set(eventBytes, 1);
        arr[eventBytes.length + 1] = 0;
        arr.set(json, event.length + 2);

        this.socket.send(arr.buffer);
    }

    on(event, callback) {
        this.listens.set(event, callback);
    }

    close() {
        this.socket.close();
    }

    set onopen(callback) {
        this.socket.onopen = callback;
    }

};