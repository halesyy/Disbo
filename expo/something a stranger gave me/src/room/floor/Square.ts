import SquareState from './SquareState';
import RenderStack from '../RenderStack';

export default class Square {

    private state: SquareState;
    private height: number;
    private _renderStack: RenderStack;

    constructor(value: any) {
        this.state = SquareState.OPEN;

        this._renderStack = new RenderStack();

        if(!isNaN(value) && isFinite(value))
        {
            if(value == 0) {
                this.height = 0;
                this.state = SquareState.EMPTY;
            }
            else {
                this.height = value - 1;
            }
        }
        else {
            switch(value) {
                case "a":
                    this.height = 10;
                    break;
                case "b":
                    this.height = 11;
                    break;
                case "c":
                    this.height = 12;
                    break;
                case "d":
                    this.height = 13;
                    break;
                default:
                    this.height = 0;
                    break;
            }

            this.state = SquareState.OPEN;
        }

    }

    get RenderStack() {
        return this._renderStack;
    }

    get Height() {
        return this.height;
    }

    public setState(squareState: SquareState) {
        this.state = squareState;
    }

    public GetState() {
        return this.state;
    }

}