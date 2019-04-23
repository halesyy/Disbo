import Point from '../util/Point';

export default class Camera {

    private _pos: Point;
    public LastFrame: number;
    public Delta: number;

    constructor(x: number = 0, y: number = 0) {
        this._pos = new Point(x, y);
        this.LastFrame = performance.now();
        this.Delta = 0;
    }

    get Pos() {
        return this._pos;
    }

    public RelativeMapPos(x: number, y: number) {
        let coordX = Math.round((x - this._pos.X - 64) / 64 + (y - this._pos.Y) / 32);
        let coordY = Math.round((y - this._pos.Y) / 32 - (x - this._pos.X) / 64);

        return new Point(coordX, coordY);
    }

    public TileToScreenCoords(x: number, y: number) {
        let screenX = this._pos.X + (1 + x - y) * 32;
        let screenY = this._pos.Y + (1 + x + y) * 16;

        return new Point(screenX, screenY);
    }

    public TileToPixels(x: number, y: number) {
        let toX = (1 + x - y) * 32;
        let toY = (1 + x + y) * 16;

        return new Point(toX, toY);
    }

    public Move(x: number, y: number) {
        this._pos.X += x;
        this._pos.Y += y;
    }

}