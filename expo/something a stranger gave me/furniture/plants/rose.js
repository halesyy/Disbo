export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 30, 74, 4, 31, 0
        );
        
        furniture.makeRenderable();

    });

}