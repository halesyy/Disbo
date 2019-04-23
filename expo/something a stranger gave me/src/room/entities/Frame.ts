import Point from '../../util/Point';

export default class Frame {

    private _from: Point;
    private _to: Point;
    private _offset: Point;
    private _delay: number;

    constructor(x: number, y: number, w: number, h: number, offsetX: number, offsetY: number, delay: number) {
        this._from = new Point(x, y);
        this._to = new Point(w, h);
        this._offset = new Point(offsetX, offsetY);
        this._delay = delay;
    }

    get From() {
        return this._from;
    }

    get To() {
        return this._to;
    }

    get Offset() {
        return this._offset;
    }

    get Delay() {
        return this._delay;
    }

}