import MovementAnimation from './MovementAnimation';
import Habbo from '../../Habbo';
import Point from '../../util/Point';

export default class RoomEntity {

    private _x: number;
    private _y: number;
    private _h: number;
    private _movementAnimation?: MovementAnimation;

    constructor(x: number, y: number, h: number) {
        this._x = x;
        this._y = y;
        this._h = h;
    }

    get X() {
        return this._x;
    }

    get Y() {
        return this._y;
    }

    get H() {
        return this._h;
    }

    get RenderPos() {

        if(this.MovementAnimation != null && !this.MovementAnimation.Finished)
            return this.MovementAnimation.RenderPos;

        return new Point(
            Habbo.Room.RoomRenderer.Camera.TileToScreenCoords(this.X, this.Y).X - 35,
            Habbo.Room.RoomRenderer.Camera.TileToScreenCoords(this.X, this.Y).Y - 100,
        );
    }

    public Move(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get MovementAnimation() {
        return this._movementAnimation;
    }

    public AddMovementAnimation(toX: number, toY: number) {
        this._movementAnimation = new MovementAnimation(this._x, this._y, toX, toY);
    }

    public update() {
        if(this._movementAnimation != null)
            this._movementAnimation.Update();
    }

}