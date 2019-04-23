import { SignalDispatcher, SimpleEventDispatcher, EventDispatcher, ISignal, ISimpleEvent, ISimpleEventHandler } from "strongly-typed-events";

import ItemPart from './ItemPart';

export default class Item {

    private _onSpriteSheetLoaded = new SimpleEventDispatcher<any>();
    private _onDoubleClick = new SimpleEventDispatcher<ItemPart>();

    private _container: string;
    private _id: string;
    private _spritesheet: any;
    private _parts: Array<ItemPart>;

    private _x: number;
    private _y: number;
    private _h: number;

    constructor(id: string, x: number, y: number, h: number) {
        this._container = id.split('.')[0];
        this._id = id.split('.')[1];
        this._x = x;
        this._y = y;
        this._h = h;

        this._parts = new Array<ItemPart>();

        let self = this;

        import('../../../../furniture/' + this._container + '/' + this._id + '.js').then((furniture) => {
            
            furniture.onCreate(self);

            import('../../../../furniture/' + this._container + '/sprites/' + this._id + '.png').then((uri) => {

                self._spritesheet = new Image();
                self._spritesheet.onload = () => {
                    self._onSpriteSheetLoaded.dispatch(this._spritesheet);
                }
                self._spritesheet.src = uri;

            });

        });
     
    }

    public get onSpriteSheetLoaded() : ISimpleEvent<any> {
        return this._onSpriteSheetLoaded.asEvent();
    }

    public get onDoubleClick() : ISimpleEvent<ItemPart> {
        return this._onDoubleClick.asEvent();
    }

    public addPart(itemPart: ItemPart) : ItemPart {
        this._parts.push(itemPart);
        return itemPart;
    }

    public get getParts() : Array<ItemPart> {
        return this._parts;
    }

    public get spriteSheet() : any {
        return this._spritesheet;
    }

    public get X() : number {
        return this._x;
    }

    public get Y() : number {
        return this._y;
    }

    public get H() : number {
        return this._h;
    }

    public createItemPart(squaresFromX: number, squaresFromY: number) {
        let itemPart = new ItemPart(this, squaresFromX, squaresFromY);
        this.addPart(itemPart);
        return itemPart;
    }

}