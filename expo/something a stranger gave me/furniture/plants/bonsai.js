export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 67, 66, 4, 44, 0
        );
        
        furniture.makeRenderable();

    });

}