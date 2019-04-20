import RoomEntity from '../RoomEntity';
import Item from './Item';
import Animator from '../Animator';
import RenderStack from '../../RenderStack';
import Habbo from '../../../Habbo';
const shortid = require('shortid');

export default class ItemPart extends RoomEntity {

    private _id: number;
    private _item: Item;
    private _animator: Animator;
    private _renderStack?: RenderStack;

    private _squaresFromBaseX: number;
    private _squaresFromBaseY: number;

    constructor(item: Item, squaresFromBaseX: number, squaresFromBaseY: number) {
        super(item.X, item.Y, item.H);

        // TODO: generate the id serverside so that it can access it
        this._id = shortid.generate();
        this._item = item;
        this._squaresFromBaseX = squaresFromBaseX;
        this._squaresFromBaseY = squaresFromBaseY;
        this._animator = new Animator(item.spriteSheet)

        Habbo.Room.Entities.set(this._id, this);

        this.update();
    }

    public get item() : Item {
        return this._item;
    }

    public get animator() : Animator {
        return this._animator;
    }

    public makeRenderable() {
        let renderStack = Habbo.Room.SquareMap.GetSquare(
            this._item.X + this._squaresFromBaseX,
            this._item.Y + this._squaresFromBaseY
        ).RenderStack;

        renderStack.AddEntity(this);
        this._renderStack = renderStack;
    }
    
}



