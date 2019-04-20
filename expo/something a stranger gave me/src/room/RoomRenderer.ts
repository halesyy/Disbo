import Room from './Room';
import UserInterface from '../userinterface/UserInterface';
import SquareMap from './floor/SquareMap';
import Habbo from '../Habbo';
import Camera from './Camera';
import EventListener from '../util/EventListener';
import Logger from '../util/Logger';
import Avatar from './entities/avatars/Avatar';
import RenderStack from './RenderStack';
import RoomEntity from './entities/RoomEntity';

export default class RoomRenderer {
    
    private _roomInstance: Room;
    private _camera: Camera;
    private _canvas: HTMLCanvasElement;
    private _context2d: CanvasRenderingContext2D;
    private _draggAble: boolean;
    private _intervalHandle: any;
    private _stopped: boolean;

    constructor(room: Room) {
        this._roomInstance = room;
        this._camera = new Camera(500, 300);

        this._canvas = <HTMLCanvasElement>document.getElementById('room');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._context2d = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        this._draggAble = true;
        this._stopped = false;
         
        // Start rendering on the canvas
        this.Prepare();
        this.Draw();

        // We have this because rAF doesn't run when tabbed out
        this._intervalHandle = setInterval(this.Handle.bind(this), 17);
        
    }

    get Canvas() {
        return this._canvas;
    }

    get Camera() {
        return this._camera;
    }

    get DraggAble() {
        return this._draggAble;
    }

    set DraggAble(state: boolean) {
        this._draggAble = state;
    }

    public Dispose() {
        this._stopped = true;
        clearInterval(this._intervalHandle);
    }

    private Prepare() {
        UserInterface.Container.$data.in_room = true;
        UserInterface.Container.$data.navigator_open = false;
    }

    private Draw() {

        if(this._stopped)
            return;

        let now = performance.now();
        this._camera.Delta = now - this._camera.LastFrame;

        if(this._camera.Delta <= 16.6) {
            window.requestAnimationFrame(this.Draw.bind(this));
            return;
        }         

        let squareMap = this._roomInstance.SquareMap;

        // Clear the canvas
        this._context2d.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Fetch image references
        let imgTile = Habbo.Assets.GetImages()["room.tile.tile_b"];
        let imgOutline = Habbo.Assets.GetImages()["room.tile.tile_outline"];
        let imgStairs = Habbo.Assets.GetImages()["room.tile.stairs"];


        // Draw tiles
        this._roomInstance.SquareMap.DrawTiles(this._context2d);
        
        // Draw tile outline if hovering over a valid square
        let relativePos = this._camera.RelativeMapPos(EventListener.currentPos.X, EventListener.currentPos.Y);
        if(squareMap.ValidTile(relativePos.X, relativePos.Y)) {
            this._context2d.drawImage(
                imgOutline,
                this._camera.Pos.X + (relativePos.X - relativePos.Y) * 32,
                this._camera.Pos.Y + (relativePos.X + relativePos.Y) * 16,
                imgOutline.width, imgOutline.height
            );
        }

        // Draw room entities
        for(let i = 0; i < squareMap.GetSize().X; i++) {
            for(let j = 0; j < squareMap.GetSize().Y; j++) {
                squareMap.GetSquare(i, j).RenderStack.Draw(this._context2d);          
            }
        }

        this._camera.LastFrame = now;

        // Redraw as soon as this rendercycle in complete
        window.requestAnimationFrame(this.Draw.bind(this));

    }

    private Handle() {
        this._roomInstance.Entities.forEach((entity: RoomEntity, id: number) => {    
            entity.update();
        });
    }

}