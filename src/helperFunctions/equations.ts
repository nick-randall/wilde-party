const degToRadians = (degrees: number) => degrees * 0.01745329252;

// const rotatePointX = (degreesRotated: number, width: number, height: number) =>
//   x + degToRadians(degreesRotated) + (x - x0)*Math.cos(degToRadians(degreesRotated)) + (y-y0)*Math.sin((degToRadians(degreesRotated))


export const widthOfRotated = (degreesRotated: number, width: number, height: number) => {
  // The ideal square is the rectangular card wrapped in a square

  const idealSquareTop = 0;
  const idealSquareRight = height + width / 2;

  const topLeftRotated = rotate(idealSquareRight / 2, idealSquareTop, 0, 0, degreesRotated);
  const bottomRightRotated = rotate(idealSquareRight / 2, idealSquareTop, width, height, degreesRotated);
  const topRightRotated = rotate(idealSquareRight / 2, idealSquareTop, width, 0, degreesRotated);
  const bottomLeftRotated = rotate(idealSquareRight / 2, idealSquareTop, 0, height, degreesRotated);

  if (degreesRotated <= 0) return topRightRotated.x - bottomLeftRotated.x;
  else return bottomRightRotated.x - topLeftRotated.x;
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

export const measureDistance = (a: number, b: number, x: number, y: number) => {
  return Math.sqrt((x - a) ^ 2 + (y - b) ^ 2);
};
