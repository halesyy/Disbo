import BaseComposer from "./BaseComposer";

export default class EnterRoomComposer extends BaseComposer {

    private _roomID: number;

    constructor(roomID: number) {
        super();
        this._roomID = roomID;

        this.Execute();
    }

    private Execute() {
        let message = {
            "header": "enter-room",
            "uid": this._roomID
        }

        this.Send(message);
    }

}