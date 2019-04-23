import FilesToPreload from './FilesToPreload';
import Logger from '../util/Logger';
import Habbo from '../Habbo';

export default class AssetHandler {
    
        private preloadCount: number;
        private images: any;
    
        constructor() {
            this.preloadCount = FilesToPreload.Paths().length;
            this.images = {};
            this.Preload();
        }
    
        private Preload() {
            for(let path of FilesToPreload.Paths()) {
                let src = this.parsePath(path);
                let name = src.substring(0, src.length - 4);
    
                this.images[path] = new Image();
                this.images[path].onload = this.preloadCallback(path);
                this.images[path].src = "assets/images/" + src;
            }
        }
    
        private preloadCallback(filename: string) {
            Logger.Log('LOADED => "' + filename + '"');
            if (--this.preloadCount <= 0) {
                Logger.Log("Finished loading presets");
                Habbo.OnPreloadFinish();
            }
        }
    
        private parsePath(src: string) {
            let path: Array<string> = src.split(".");
            let fullPath: string = "";
    
            let i = 1;

            for(let part of path) {            

                if(i == path.length) {
                    fullPath += part + ".png";
                } else {
                    fullPath += part + "/";
                }

                i++;
                
            }
    
            return fullPath;
        }
    
        public GetImages() {
            return this.images;
        }
    
    }