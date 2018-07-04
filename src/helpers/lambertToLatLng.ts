import { LatLngCoordinate } from "../types";

export default function lambertToLatLng(x: number, y: number): LatLngCoordinate {
  let newLongitude, newLatitude;
  const n = 0.77164219,
    F = 1.81329763,
    thetaFudge = 0.00014204,
    e = 0.08199189,
    a = 6378388,
    xDiff = 149910,
    yDiff = 5400150,
    theta0 = 0.07604294,
    xReal = xDiff - x,
    yReal = yDiff - y,
    rho = Math.sqrt(xReal * xReal + yReal * yReal),
    theta = Math.atan(xReal / -yReal);

  newLongitude = (theta0 + (theta + thetaFudge) / n) * 180 / Math.PI;
  newLatitude = 0;

  for (let i = 0; i < 5; ++i) {
    newLatitude = (2 * Math.atan(
      Math.pow(F * a / rho, 1 / n) *
      Math.pow((1 + e * Math.sin(newLatitude)) / (1 - e * Math.sin(newLatitude)), e / 2)
    )) - Math.PI / 2;
  }
  newLatitude *= 180 / Math.PI;
  return { lat: newLatitude, lng: newLongitude };
}
