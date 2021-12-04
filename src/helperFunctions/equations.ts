const degToRadians = (degrees: number) => degrees * 0.01745329252;

export const widthOfRotated = (degreesRotated: number, width: number, height: number) =>
  Math.cos(degToRadians(degreesRotated)) * width + Math.sin(degToRadians(degreesRotated) * height);
