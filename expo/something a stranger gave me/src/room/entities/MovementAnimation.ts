import Point from '../../util/Point';
import Habbo from '../../Habbo';
import RoomRenderer from '../RoomRenderer';
import Camera from '../Camera';

export default class MovementAnimation {

    private _fromX: number;
    private _fromY: number;
    private _toX: number;
    private _toY: number;
    private _renderX: number;
    private _renderY: number;
    private _startTime: number;
    private _inc: number;

    public Finished: boolean;

    constructor(fromX: number, fromY: number, toX: number, toY: number) {
        this._fromX = Habbo.Room.RoomRenderer.Camera.TileToPixels(fromX, fromY).X;
        this._fromY = Habbo.Room.RoomRenderer.Camera.TileToPixels(fromX, fromY).Y;
        this._toX = Habbo.Room.RoomRenderer.Camera.TileToPixels(toX, toY).X;
        this._toY = Habbo.Room.RoomRenderer.Camera.TileToPixels(toX, toY).Y;
        this._renderX = Habbo.Room.RoomRenderer.Camera.TileToPixels(fromX, fromY).X;
        this._renderY = Habbo.Room.RoomRenderer.Camera.TileToPixels(fromX, fromY).Y;
        this._startTime = performance.now();
        this._inc = 0;
        this.Finished = false;
    }

    public Update() {

        let now = performance.now();

        this._inc++;
        
        if(now - this._startTime > 500) {
            if(!this.Finished && this._inc > 0)
                this.Finished = true;
            return;
        }

        let divider = 30;

        if(this._fromX > this._toX) {
            if(this._renderX > this._toX)
                this._renderX -= (this._fromX - this._toX) / divider;
        }

        if(this._fromX < this._toX) {
            if(this._renderX < this._toX)
                this._renderX += (this._toX - this._fromX) / divider;
        }

        if(this._fromY > this._toY) {
            if(this._renderY > this._toY)
                this._renderY -= (this._fromY - this._toY) / divider;
        }

        if(this._fromY < this._toY) {
            if(this._renderY < this._toY)
                this._renderY += (this._toY - this._fromY) / divider;
        }       
        
    }

    get RenderPos() {
        return new Point(
            Habbo.Room.RoomRenderer.Camera.Pos.X + this._renderX - 35,
            Habbo.Room.RoomRenderer.Camera.Pos.Y + this._renderY - 100,
        );
    }

}