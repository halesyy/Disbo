import BaseComposer from "./BaseComposer";

export default class RoomListComposer extends BaseComposer {

    private _listName: string;

    constructor(listName: string) {
        super();
        this._listName = listName;

        this.Execute();
    }

    private Execute() {
        let message = {
            "header": "room-list",
            "list_name": this._listName
        }

        this.Send(message);
    }

}