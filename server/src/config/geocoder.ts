import { Item } from "../models/item_model";
import { User } from "../models/user_model";

export const NodeGeocoder = require('node-geocoder');
export const geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: 'a48917e616164965be4cb14a9d3bd734'
});

export const getGeoLocation = async (obj: Item | User) => {
    //Generating Address-String for geoCoder
    const address_string =
        obj.address.street + ' '
        + obj.address.houseNumber + ', '
        + obj.address.zip + ', '
        + obj.address.city;
    const resGeo: any[] = await geocoder.geocode(address_string);
    resGeo.sort((a, b) => a.extra.confidence - b.extra.confidence);
    console.log(resGeo);
    return resGeo;
};