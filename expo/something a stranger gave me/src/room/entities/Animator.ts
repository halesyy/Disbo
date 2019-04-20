import Frame from './Frame';

export default class Animator {

    private _frame: number;
    private _frames: Array<Frame>;
    private _lastFrame: Date;
    private _spriteSheet: any;

    constructor(spriteSheet: any) {
        this._frame = 0;
        this._frames = new Array<Frame>();
        this._lastFrame = new Date();
        this._spriteSheet = spriteSheet;
    }

    get spriteSheet() {
        return this._spriteSheet;
    }

    public addFrame(x: number, y: number, w: number, h: number, offsetX: number, offsetY: number, delay: number) {
        this._frames.push(new Frame(x, y, w, h, offsetX, offsetY, delay));
    }

    public nextFrame() {
        // TODO: replace date with performance.now
        let now = new Date();
        let delta = now.getTime() - this._lastFrame.getTime();

        if(delta >= this._frames[this._frame].Delay) {
            this._lastFrame = now;

            if(this._frame >= this._frames.length - 1)
                this._frame = 0;
            else
                this._frame++;
        }

        return this._frames[this._frame];
    }

}



