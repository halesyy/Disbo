export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 35, 97, 1, 8, 0
        );
        
        furniture.makeRenderable();

    });

}