import RoomEntity from './entities/RoomEntity';
import Avatar from './entities/avatars/Avatar';
import Habbo from '../Habbo';
import SquareMap from './floor/SquareMap';
import ItemPart from './entities/items/ItemPart';

export default class RenderStack {

    private _stack: Array<RoomEntity>;

    constructor() {
        this._stack = new Array<RoomEntity>();
    }

    public Draw(context2d: CanvasRenderingContext2D) {      
        
        this._stack.forEach(function(entity) {

            if(entity instanceof Avatar) {

                context2d.drawImage(
                    entity.Animation.spriteSheet,
                    Math.round(entity.Animation.nextFrame().From.X),
                    Math.round(entity.Animation.nextFrame().From.Y),
                    Math.round(entity.Animation.nextFrame().To.X),
                    Math.round(entity.Animation.nextFrame().To.Y),
                    Math.round(entity.RenderPos.X),
                    Math.round(entity.RenderPos.Y - Habbo.Room.SquareMap.GetSquare(entity.Y, entity.X).Height * 32),
                    Math.round(entity.Animation.nextFrame().To.X),
                    Math.round(entity.Animation.nextFrame().To.Y)
                );

            }
            else if(entity instanceof ItemPart) {

                context2d.drawImage(
                    entity.item.spriteSheet,
                    Math.round(entity.animator.nextFrame().From.X),
                    Math.round(entity.animator.nextFrame().From.Y),
                    Math.round(entity.animator.nextFrame().To.X),
                    Math.round(entity.animator.nextFrame().To.Y),
                    Math.round((entity.RenderPos.X + 32.5 - entity.item.spriteSheet.width / 2) + entity.animator.nextFrame().Offset.X),
                    Math.round(entity.RenderPos.Y + entity.animator.nextFrame().Offset.Y - entity.H * 30),
                    Math.round(entity.animator.nextFrame().To.X),
                    Math.round(entity.animator.nextFrame().To.Y)
                );

            }

        });
    }

    public AddEntity(entity: RoomEntity) {
        this._stack.push(entity);
        this.Sort();
    }

    public RemoveEntity(entity: RoomEntity) {
        let i = this._stack.indexOf(entity);
        this._stack.splice(i, 1);
    }

    public Sort() {
        this._stack.sort((a, b) => a.H - b.H);
    }

}