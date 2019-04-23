export function onCreate(item) {

    item.onSpriteSheetLoaded.subscribe(() => {

        let leftPart = item.createItemPart(0, 0);
        let rightPart = item.createItemPart(1, 0);

        leftPart.animator.addFrame(
            55, 0, 48, 62, 28, 49, 0
        );

        rightPart.animator.addFrame(
            0, 0, 55, 64, 59, 65, 0
        );

        leftPart.makeRenderable();
        rightPart.makeRenderable();

    });

}