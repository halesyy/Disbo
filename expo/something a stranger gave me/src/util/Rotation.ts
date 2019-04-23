export default class Rotation {

    public static Calculate(fromX: number, fromY: number, toX: number, toY: number) {
        let dX = fromX - toX;
        let dY = fromY - toY;

        let rotInDegrees = 4 * Math.atan2(dY, dX) / Math.PI + 2;
        return rotInDegrees;
    }

}