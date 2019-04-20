export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 52, 113, 3, -2, 0
        );
        
        furniture.makeRenderable();

    });

}