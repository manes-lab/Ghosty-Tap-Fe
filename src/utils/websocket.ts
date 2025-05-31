//"wss://ws.okx.com:8443/ws/v5/business"


// websocket
let ws: WebSocket | undefined;
let lastTime = 0

export function initWebSocket(instId: string, callback: Function) {
    ws?.close()
    // let url = `wss://${window.location.host}/ws`
    // if (window.location.protocol == "http:") {
    //   url = `ws://${window.location.host}/ws`
    // }

    let url = "wss://ws.okx.com:8443/ws/v5/business"
    
    ws = new WebSocket(url);
    let channels = [
        {"channel": "candle1s", "instId": instId + "-SWAP"},
    ]
    let subParam = {"op": "subscribe", "args": channels}

    ws.onopen = () => {
        console.log("websocket initialized")
        ws?.send(JSON.stringify(subParam))
    };
    ws.onmessage = (e: any) => {
        const data = e.data.indexOf("{")>-1 ? JSON.parse(e.data).data : null;
        callback(data)
    };

    ws.onerror = (e: any) => {
        console.log('error', e);
        initWebSocket(instId, callback)
    };

    ws.onclose = (e: any) => {
        console.log(e)
        if (e.reason == "force") {
            ws = undefined
            return
        }
        console.log('close');
        // initWebSocket(instId, callback)
    };

}

export function close() {
    ws?.close(1000, "force")
}