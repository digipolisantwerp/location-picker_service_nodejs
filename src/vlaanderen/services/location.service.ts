import { LatLngCoordinate as LatLng, LocationItem } from '../../types';
import { LocationServiceConfig as Config, LocationQuery } from '../types';
import axios from 'axios';

const LocationType: any = {
  crab_straat: 'street',
};

function formatResponseID(data: any) {
  const items: number[] = [];
  return data._embedded.addressdetail.map((item: any) => {
    const locationType: string = item.LocationType;
    const location = {
      X_Lambert72: item.addressPosition.xlambert72,
      Y_Lambert72: item.addressPosition.ylambert72,
      lat: item.addressPosition.latwgs84,
      lng: item.addressPosition.lonwgs84,
    };
    return ({
      id: item.addressid,
      name: item.formattedAddress,
      locationType: "street",
      coordinates: {
        lambert: {
          x: location.X_Lambert72,
          y: location.Y_Lambert72
        },
        latLng: {
          lat: location.lat,
          lng: location.lng
        }
      },
      street: item.street.streetName
    });
  }).filter((item: any) => {
    const found = !(items.includes(item.id));
    items.push(item.id);
    return found;
  });
}
function formatResponse(data: any) {
  const items: number[] = [];
  return data.filter((item: any) => {
    const filter = !(items.includes(item.ID));
    items.push(item.id);
    return filter;
  }).map((item: any) => {
    const locationType: string = item.LocationType;
    const location = {
      X_Lambert72: item.Location.X_Lambert72,
      Y_Lambert72: item.Location.Y_Lambert72,
      lat: item.Location.Lat_WGS84,
      lng: item.Location.Lon_WGS84
    };
    return ({
      id: item.ID,
      name: item.FormattedAddress,
      locationType: LocationType[locationType],
      coordinates: {
        lambert: {
          x: location.X_Lambert72,
          y: location.Y_Lambert72
        },
        latLng: {
          lat: location.lat,
          lng: location.lng
        }
      },
      street: item.Thoroughfarename,
    });
  });
}

const getById = async (id: string, config: Config) => {
  const { data } = await axios.get(`${config.locationIdUrl}/addressdetails/${id}`);

  return data;
};

async function getStreets(query: string, config: Config) {
  const { data } = await axios.get(`${config.locationUrl}/Location`, {
    params: { q: query, c: 5, type: 'Thoroughfarename' },
  });
  return data.LocationResult;
}

async function getNumber(query: string, config: Config) {
  const { data } = await axios.get(`${config.locationUrl}/Location`, {
    params: { q: query, c: 5, type: 'Housenumber' },
  });
  return data.LocationResult;
}

async function getPoi(query: string, config: Config) {
  if (config.locationPoiUrl) {
    const { data } = await axios.get(`${config.locationPoiUrl}/Location`,
      { params: { poi: query, c: 5 }
    });
    return data.LocationResult;
  }
  return [];
}

const sources: any = { street: getStreets, number: getNumber, poi: getPoi };

export async function queryLocation(query: LocationQuery, config: Config): Promise<LocationItem> {
  if (query.id) {
    const result = await getById(query.id, config);
    return formatResponseID(result);
  }
  const types: string = Object.assign(query.types);
  const results = [].concat.apply([], await Promise.all(types.split(',').map((dataType) => {
    if (sources[dataType]) {
       return sources[dataType](query.search, config);
    }
  }).filter((x) => x)));
  return formatResponse(results);
}

export {
  getById,
};
