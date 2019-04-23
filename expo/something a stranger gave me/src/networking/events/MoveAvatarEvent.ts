import BaseEvent from './BaseEvent';
import Habbo from '../../Habbo';
import Room from '../../room/Room';
import Avatar from '../../room/entities/avatars/Avatar';
import Point from '../../util/Point';
import SquareMap from '../../room/floor/SquareMap';
import RenderStack from '../../room/RenderStack';

export default class MoveAvatarEvent extends BaseEvent {

    private _id: number;
    private _x: number;
    private _y: number;

    constructor(data: any) {
        super(data);

        this._id = data["id"];
        this._x = data["x"];
        this._y = data["y"];

        this.Execute();
    }

    private Execute() {

        let avatar = Habbo.Room.Entities.get(this._id);
        if(!avatar)
            return;     

        (<Avatar>avatar).Walking = true;
        (<Avatar>avatar).UpdateAnimator(this._x, this._y);        
        (<Avatar>avatar).AddMovementAnimation(this._x, this._y);


        // TODO: Synchronous queue for moving avatars between renderstacks instead of this shenanigan
        setTimeout(() => {
            if(avatar != null) {
                Habbo.Room.SquareMap.GetSquare(avatar.X, avatar.Y).RenderStack.RemoveEntity(avatar);
                avatar.Move(this._x, this._y);
                Habbo.Room.SquareMap.GetSquare(avatar.X, avatar.Y).RenderStack.AddEntity(avatar);
            }    
        }, 250);
    
    }
    
}