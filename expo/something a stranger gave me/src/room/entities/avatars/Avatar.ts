import RoomEntity from '../RoomEntity';
import Point from '../../../util/Point';
import Animator from '../Animator';
import Habbo from '../../../Habbo';
import AvatarAnimations from './AvatarAnimations';
import Rotation from '../../../util/Rotation';
import MovementAnimation from '../MovementAnimation';

export default class Avatar extends RoomEntity {

    private _walking: boolean;
    private _rotation: number;

    private _look: string;

    private _animations: AvatarAnimations;
    private _animator: Animator;

    constructor(x: number, y: number, rotation: number, look: string) {
        super(x, y, 0); // last one = z (forced 0 for now)
        
        this._walking = false;
        this._rotation = rotation;

        this._look = look;

        this._animations = new AvatarAnimations(Habbo.Assets.GetImages()[("avatar." + look)]);
        this._animator = this._animations.idleDownRight;
        this.UpdateAnimator(x, y);

    }

    get Walking() {
        return this._walking;
    }

    set Walking(state: boolean) {
        this._walking = state;
    }

    get Rotation() {
        return this._rotation;
    }

    get Animations() {
        return this._animations;
    }

    set Rotation(rot: number) {
        this._rotation = rot;
    }

    get RenderPos() {

        if(this.MovementAnimation != null && !this.MovementAnimation.Finished)
            return this.MovementAnimation.RenderPos;

        return new Point(
            Habbo.Room.RoomRenderer.Camera.TileToScreenCoords(this.X, this.Y).X - 35,
            Habbo.Room.RoomRenderer.Camera.TileToScreenCoords(this.X, this.Y).Y - 100,
        );
    }

    get Animation() {

        return this._animator;

    }

    public UpdateAnimator(toX: number, toY: number) {

        let rotation = Rotation.Calculate(this.X, this.Y, toX, toY);
        if(this.X == toX && this.Y == toY)
            rotation = this._rotation;
        else
            this._rotation = rotation;

        switch(rotation) {
            case -1:
            {
                if(this._walking)
                    this._animator = this._animations.walkDown;
                else
                    this._animator = this._animations.idleDown;
                break;
            }
            case 0:
            {
                if(this._walking)
                    this._animator = this._animations.walkDownLeft;
                else
                    this._animator = this._animations.idleDownLeft;
                break;
            }
            case 1:
            {
                if(this._walking)
                    this._animator = this._animations.walkLeft;
                else
                    this._animator = this._animations.idleLeft;
                break;
            }
            case 2:
            {
                if(this._walking)
                    this._animator = this._animations.walkUpLeft;
                else
                    this._animator = this._animations.idleUpLeft;
                break;
            }
            case 3:
            {
                if(this._walking)
                    this._animator = this._animations.walkUp;
                else
                    this._animator = this._animations.idleUp;
                break;
            }
            case 4:
            {
                if(this._walking)
                    this._animator = this._animations.walkUpRight;
                else
                    this._animator = this._animations.idleUpRight;
                break;
            }
            case 5:
            {
                if(this._walking)
                    this._animator = this._animations.walkRight;
                else
                    this._animator = this._animations.idleRight;
                break;
            }
            case 6:
            {
                if(this._walking)
                    this._animator = this._animations.walkDownRight;
                else
                    this._animator = this._animations.idleDownRight;
                break;
            }
        }


    }

}