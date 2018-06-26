const lambertToLatLng = require('../dist/helpers/lambertToLatLng').default;

describe('lambertToLatLng', () => {
    it('should convert coordinates', () => {
        // generaal armstrongweg 1
        const lambert = { x: 150910.29, y: 209456.61 };
        const latLng = lambertToLatLng(lambert.x, lambert.y);
        expect(latLng.lat).toBeCloseTo(51.1951);
        expect(latLng.lng).toBeCloseTo(4.3818);
    });
});