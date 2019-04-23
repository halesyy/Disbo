export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 47, 72, 3, 38, 0
        );
        
        furniture.makeRenderable();

    });

}