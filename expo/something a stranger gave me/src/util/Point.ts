export default class Point {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get X() {
        return this._x;
    }

    get Y() {
        return this._y;
    }

    set X(x) {
        this._x = x;
    }

    set Y(y) {
        this._y = y;
    }
}