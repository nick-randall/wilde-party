const degToRadians = (degrees: number) => degrees * 0.01745329252;

// const rotatePointX = (degreesRotated: number, width: number, height: number) => 
//   x + degToRadians(degreesRotated) + (x - x0)*Math.cos(degToRadians(degreesRotated)) + (y-y0)*Math.sin((degToRadians(degreesRotated))

export const widthOfRotated = (degreesRotated: number, width: number, height: number) =>
  (Math.cos(degToRadians(degreesRotated)) * width+ Math.sin(degToRadians(degreesRotated)) * height)/2;
