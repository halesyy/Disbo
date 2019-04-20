import SingleSignOnComposer from './composers/SingleSignOnComposer';
import Config from '../Config';
import MessageParser from './MessageParser';
import Logger from '../util/Logger';
import Habbo from '../Habbo';
export default class Networker {

    private _webSocket: any;

    constructor() {

        // Establish a new websocket connection
        this._webSocket = new WebSocket("ws://" + Config.connection.host + ":" + Config.connection.port);

        this._webSocket.onopen = this.OnConnect;
        this._webSocket.onmessage = this.OnMessage;

    }

    private OnConnect() {
        Logger.Log("Successfully connected to the server");
    }

    private OnMessage(message: any) {
        MessageParser.Transmit(message.data);
    }

    // Sends a message to the server
    public SendMessage(message: any) {
        Logger.Log("-> " + message);
        this._webSocket.send(message);
    }

}