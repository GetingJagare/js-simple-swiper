import { Line } from "../interfaces/math";

export const linesAngle = (line1: Line, line2: Line): number => {
    const dist1 = Math.sqrt(Math.pow(line1[1].x - line1[0].x, 2) + Math.pow(line1[1].y - line1[0].y, 2));
    const dist2 = Math.sqrt(Math.pow(line2[1].x - line2[0].x, 2) + Math.pow(line2[1].y - line2[0].y, 2));

    return Math.acos(dist1 / dist2) * 180 / Math.PI;
}