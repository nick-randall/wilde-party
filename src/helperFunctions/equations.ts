const degToRadians = (degrees: number) => degrees * 0.01745329252;

// const rotatePointX = (degreesRotated: number, width: number, height: number) =>
//   x + degToRadians(degreesRotated) + (x - x0)*Math.cos(degToRadians(degreesRotated)) + (y-y0)*Math.sin((degToRadians(degreesRotated))

export const widthOfRotated = (degreesRotated: number, width: number, height: number) =>
  (Math.cos(degToRadians(degreesRotated)) * width + Math.sin(degToRadians(degreesRotated)) * height) / 2;

export const widthOfRotated2 = (degreesRotated: number, width: number, height: number) => {
  console.log(height)
  const idealSquareLeft = 0;
  const idealSquareTop = 0;
  const idealSquareRight = height;
  const idealSquareBottom = height
  // console.log(idealSquareRight, idealSquareLeft)
  const topLeftRotated = rotate(height / 2, height / 2, idealSquareLeft, idealSquareTop, degreesRotated);
  const bottomRightRotated = rotate(height / 2, height / 2, idealSquareRight, idealSquareBottom, degreesRotated);
  const bottomLeftRotated = rotate(height / 2, height / 2, idealSquareLeft, idealSquareBottom, degreesRotated);
  const topRightRotated = rotate(height / 2, height / 2, idealSquareRight, idealSquareTop, degreesRotated);
  console.log(topRightRotated, "topRightRotated");
  console.log(bottomLeftRotated, "bottomLeftRotated")
  return topRightRotated.x - bottomLeftRotated.x;
};

// cx & cy are the center of rotation.
export function rotate(cx: number, cy: number, x: number, y: number, angle: number) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
}
