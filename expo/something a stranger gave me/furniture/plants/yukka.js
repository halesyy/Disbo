export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe((spritesheet) => {

        let furniture = item.createItemPart(0, 0);

        furniture.animator.addFrame(
            0, 0, 88, 153, -1, -42, 0
        );
        
        furniture.makeRenderable();

    });

}