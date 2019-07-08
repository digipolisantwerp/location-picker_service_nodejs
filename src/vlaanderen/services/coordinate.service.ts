import { LatLngCoordinate as LatLng, LocationItem } from '../../types';
import { CoordinateServiceConfig as Config } from '../types';
import axios from 'axios';

const LocationType: any = {
  crab_straat: 'street',
  crab_huisnummer_afgeleidVanGebouw: 'street',
};

function combineLatLng(coordinates: LatLng) {
    return `${coordinates.lat},${coordinates.lng}`;
}

function formatResponse(data: any): LocationItem {
  const [location] = data;
  return ({
    id: location.ID,
    name: location.FormattedAddress,
    street: location.Thoroughfarename,
    number: location.Housenumber,
    postal: location.Zipcode,
    district: location.Municipality,
    locationType: LocationType[location.LocationType],
    coordinates: {
      latLng: {
        lat: location.Location.Lat_WGS84,
        lng: location.Location.Lon_WGS84
      }
    }
  });
}

export async function getByCoordinates(coordinates: LatLng, config: Config): Promise<LocationItem> {
  const { data } = await axios.get(config.gisUrl, {
    params: {
      latlon: combineLatLng(coordinates),
    },
  });
  return formatResponse(data.LocationResult);
}
