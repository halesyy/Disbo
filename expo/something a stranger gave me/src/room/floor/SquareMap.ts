import Square from './Square';
import Point from '../../util/Point';
import Logger from '../../util/Logger';
import Room from '../Room';
import Camera from '../Camera';
import Habbo from '../../Habbo';

export default class SquareMap {

    private squares: Array<any>;
    private floorData: string;
    private size: Point;

    constructor(size: number, floorData: string) {
        this.floorData = floorData;
        this.size = this.GetMapSize(floorData, size);
        this.squares = this.Create2dSquareMap();
    }

    public GetSquare(x: number, y: number) {
        return this.squares[x][y];
    }

    public GetSize() {
        return this.size;
    }

    private GetMapSize(floorData: string, size: number) {
        return new Point(size, (floorData.length / size));
    }

    private Create2dSquareMap() {
        let arr = new Array(this.size.X);
        for(let i = 0; i < this.size.X; i++) {
            arr[i] = new Array(this.size.Y);
            for(let n = 0; n < this.size.Y; n++) {
                arr[i][n] = new Square(this.ValueFromFloorData(i, n));
            }
        }
        return arr;
    }

    private ValueFromFloorData(x: number, y: number) {
         let index = this.size.X * y;
         return this.floorData.substring(index + x, index + x + 1);
    }

    public ValidTile(x: number, y: number) {
        try {
            if(this.GetSquare(y, x).GetState() == 1)
                return true;
        }
        catch(e) {
            return false;
        }
    }

    public DrawTiles(context2d: CanvasRenderingContext2D) {

        let imgTile = Habbo.Assets.GetImages()["room.tile.tile_b"];
        let imgStairRight = Habbo.Assets.GetImages()["room.tile.stair_right"];
        let imgStairLeft = Habbo.Assets.GetImages()["room.tile.stair_left"];
        let imgStairMiddle = Habbo.Assets.GetImages()["room.tile.stair_middle"];

        for(let i = 0; i < this.GetSize().X; i++) {
            for(let j = 0; j < this.GetSize().Y; j++) {
                if(this.GetSquare(i, j).GetState() != 0) {                  

                    // Heavy, but only needs to be drawn once on its own canvas
                    
                    if(j > 0 && this.GetSquare(i, j - 1).Height == this.GetSquare(i, j).Height + 1) {
                        
                        context2d.drawImage(
                            imgStairRight,
                            (Habbo.Room.RoomRenderer.Camera.Pos.X + (j - i) * 32),
                            (Habbo.Room.RoomRenderer.Camera.Pos.Y + (j + i) * 16) - this.GetSquare(i, j - 1).Height * 32,
                            imgStairRight.width,
                            imgStairRight.height
                        );

                    }
                    else if(i > 0 && this.GetSquare(i - 1, j).Height == this.GetSquare(i, j).Height + 1) {
                        context2d.drawImage(
                            imgStairLeft,
                            (Habbo.Room.RoomRenderer.Camera.Pos.X + (j - i) * 32),
                            (Habbo.Room.RoomRenderer.Camera.Pos.Y + (j + i) * 16) - this.GetSquare(i - 1, j).Height * 32,
                            imgStairLeft.width,
                            imgStairLeft.height
                        );
                    }
                    else if(j > 0 && i > 0 && this.GetSquare(i - 1, j - 1).Height == this.GetSquare(i, j).Height + 1) {

                        context2d.drawImage(
                            imgStairMiddle,
                            (Habbo.Room.RoomRenderer.Camera.Pos.X + (j - i) * 32) + 2,
                            (Habbo.Room.RoomRenderer.Camera.Pos.Y + (j + i) * 16) - 24,
                            imgStairMiddle.width,
                            imgStairMiddle.height
                        );

                    }
                    else {
                        context2d.drawImage(
                            imgTile,
                            Habbo.Room.RoomRenderer.Camera.Pos.X + (j - i) * 32,
                            (Habbo.Room.RoomRenderer.Camera.Pos.Y + (j + i) * 16) - this.GetSquare(i, j).Height * 32,
                            imgTile.width,
                            imgTile.height
                        );
                    }                                      
                }            
            }
        }
    }

    

}