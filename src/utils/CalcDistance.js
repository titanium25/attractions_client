function convertDegToRad(deg) {
    return deg * (Math.PI/180)
}

/*
Haversine formula,
which calculates the distance between two points on a sphere as the crow flies
 */

const CalcDistance = (point1, point2) => {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const earthRadius = 6371;
    const dLat = convertDegToRad(lat2 - lat1);
    const dLon = convertDegToRad(lon2 - lon1);
    const squareHalfChordLength =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(convertDegToRad(lat1)) * Math.cos(convertDegToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const angularDistance = 2 * Math.atan2(Math.sqrt(squareHalfChordLength), Math.sqrt(1 - squareHalfChordLength));
    return earthRadius * angularDistance;
};

export default CalcDistance;