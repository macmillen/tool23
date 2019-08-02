import { Item } from "../models/item_model";
import { User } from "../models/user_model";

// export geoCoder config to use it across the application
export const NodeGeocoder = require('node-geocoder');
export const geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: 'a48917e616164965be4cb14a9d3bd734'
});

/**
 * calculates lat and long from the object address
 * @param obj item or user
 */
export const getGeoLocation = async (obj: Item | User) => {
    //Generating Address-String for geoCoder
    const address_string =`${obj.address.street} ${obj.address.houseNumber}, ${obj.address.zip}, ${obj.address.city}`;
    const resGeo: any[] = await geocoder.geocode(address_string);
    resGeo.sort((a, b) => a.extra.confidence - b.extra.confidence);

    if (!resGeo || resGeo.length === 0) { return null; }

    return [resGeo[0]["longitude"], resGeo[0]["latitude"]] as number[];
};