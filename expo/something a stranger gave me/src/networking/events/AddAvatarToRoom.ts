import BaseEvent from './BaseEvent';
import Habbo from '../../Habbo';
import Room from '../../room/Room';
import Avatar from '../../room/entities/avatars/Avatar';

export default class AddAvatarToRoom extends BaseEvent {

    private _id: number;
    private _x: number;
    private _y: number;
    private _rotation: number;
    private _look: string;

    constructor(data: any) {
        super(data);

        this._id = data["id"];
        this._x = data["x"];
        this._y = data["y"];
        this._rotation = data["r"];
        this._look = data["look"];

        this.Execute();
    }

    private Execute() {

        let avatar = new Avatar(this._x, this._y, this._rotation, this._look);
        Habbo.Room.Entities.set(this._id, avatar);

        Habbo.Room.SquareMap.GetSquare(this._x, this._y).RenderStack.AddEntity(avatar);
    
    }
    
}