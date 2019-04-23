import BaseComposer from "./BaseComposer";

export default class MoveAvatarComposer extends BaseComposer {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        super();
        this._x = x;
        this._y = y;

        this.Execute();
    }

    private Execute() {
        let message = {
            "header": "move-avatar",
            "x": this._x,
            "y": this._y
        }

        this.Send(message);
    }

}