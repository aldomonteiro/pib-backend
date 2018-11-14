import Customer from '../models/customers';
import axios from 'axios';

export const checkCustomerAddress = async (pageID, userID, location) => {
    let addressData = await getCustomerAddress(pageID, userID);
    if (addressData) {
        return addressData;
    } else {
        addressData = await getAddressLocation(location);
        if (addressData.status === 200) {
            return addressData;
        }
        else return null;
    }
}

export const getCustomerAddress = async (pageID, userID) => {

    const customer = await Customer.findOne({ pageId: pageID, userId: userID }).exec();

    if (customer) {
        if (customer.addr_formatted || customer.addr_street) {
            let addressData = {};
            addressData.formattedAddress = customer.addr_formatted;
            addressData.street = customer.addr_street;
            addressData.street_number = customer.addr_streetnumber;
            addressData.sublocality = customer.addr_sublocality;
            addressData.state = customer.addr_state;
            addressData.city = customer.addr_city;
            addressData.postal_code = customer.addr_postalcode;
            return addressData;
        } else return null;
    } else return null;
}

export const getAddressLocation = async (location) => {
    const response = await googleMapsAPI(location, process.env.GOOGLE_MAPS_APIKEY);
    console.info({ response });
    if (response.status === 200) {
        if (response.data.error_message && response.data.status === 'OVER_QUERY_LIMIT') {
            const response2 = await googleMapsAPI(location, process.env.GOOGLE_MAPS_APIKEY2);
            if (response2.status === 200) {
                if (response2.data.error_message && response2.data.status === 'OVER_QUERY_LIMIT') {
                    const response3 = await googleMapsAPI(location, process.env.GOOGLE_MAPS_APIKEY3);
                    if (response3.status === 200) {
                        if (response3.data.error_message && response3.data.status === 'OVER_QUERY_LIMIT') {
                            const response4 = await googleMapsAPI(location, process.env.GOOGLE_MAPS_APIKEY4);
                            if (response4.status === 200) {
                                if (response4.data.error_message && response4.data.status === 'OVER_QUERY_LIMIT') {
                                    const response5 = await googleMapsAPI(location, process.env.MY_GOOGLE_MAPS_APIKEY);
                                    if (response5.status === 200) {
                                        if (response5.data.error_message && response5.data.status === 'OVER_QUERY_LIMIT') {
                                            console.error(response5.status, response5.statusText);
                                            return null;
                                        } else return response5.data.results;
                                    } else return null;
                                } else return response4.data.results;
                            } else return null;
                        } else return response3.data.results;
                    } else return null;
                } else return response2.data.results;
            } else return null;
        } else return response.data.results;
    } else return null;
}

const googleMapsAPI = async (location, API_KEY) => {
    console.info('using:' + API_KEY);
    return await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            'latlng': location.lat + ',' + location.long,
            'key': API_KEY,
        }
    });
}

export const customer_update = async (custData) => {

    const customer = await Customer.findOne({ pageId: custData.pageId, userId: custData.userId }).exec();

    if (customer && customer.id) {
        const { first_name, last_name, phone, profile_pic, location, addrData } = custData;

        let updateDb = false;
        if (first_name || last_name) {
            customer.first_name = first_name;
            customer.last_name = last_name;
            updateDb = true;
        }
        if (profile_pic) {
            customer.profilePic = profile_pic;
            updateDb = true;
        }
        if (phone) {
            customer.phone = phone;
            updateDb = true;
        }
        if (location) {
            customer.location_lat = location.lat;
            customer.location_long = location.long;
            customer.location_url = location.url;
            updateDb = true;
        }
        if (addrData) {
            if (addrData.manual_address)
                customer.addr_manual = true;
            else
                customer.addr_manual = false;

            customer.addr_formatted = addrData.formattedAddress;
            customer.addr_street = addrData.street;
            customer.addr_sublocality = addrData.sublocality;
            customer.addr_streetnumber = addrData.street_number;
            customer.addr_state = addrData.state;
            customer.addr_city = addrData.city;
            customer.addr_postalcode = addrData.postal_code;
            updateDb = true;
        }

        if (updateDb) {
            await customer.save((err, result) => {
                if (err) throw err;
            });
        }
    } else {
        const resultLastId = Customer.find({ pageId: custData.pageId })
            .select('id')
            .sort('-id')
            .limit(1)
            .exec();
        let lastId = 0;
        if (resultLastId && resultLastId.length) lastId = resultLastId[0];

        const newRecord = new Customer({
            id: lastId + 1,
            userId: custData.userId,
            pageId: custData.pageId,
            first_name: custData.first_name,
            last_name: custData.last_name,
            profilePic: custData.profile_pic,
            email: custData.email,
            phone: custData.phone,
            addr_formatted: custData.addr ? custData.addr.formattedAddress : null,
            addr_street: custData.addr ? custData.addr.street : null,
            addr_sublocality: custData.addr ? custData.addr.sublocality : null,
            addr_streetnumber: custData.addr ? custData.addr.street_number : null,
            addr_state: custData.addr ? custData.addr.state : null,
            addr_city: custData.addr ? custData.addr.city : null,
            addr_postalcode: custData.addr ? custData.addr.postal_code : null,
            location_lat: custData.location ? custData.location.lat : null,
            location_long: custData.location ? custData.location.long : null,
            location_url: custData.location ? custData.location.url : null,
        });

        newRecord.save((err, result) => {
            if (err) throw err;
        });
    }
}

export const formatAddrData = async addrData => {
    let formattedAddressData = {}
    formattedAddressData.formattedAddress = addrData.formatted_address;
    const addComps = addrData.address_components;

    addComps.forEach(element => {
        element.types.forEach(type => {
            if (type === 'street_number') {
                formattedAddressData.street_number = element.long_name;
            } else if (type === 'route') {
                formattedAddressData.street = element.long_name;
            } else if (type === 'sublocality' || type === 'sublocality_level_1') {
                formattedAddressData.sublocality = element.long_name;
            } else if (type === 'administrative_area_level_2') {
                formattedAddressData.city = element.long_name;
            } else if (type === 'administrative_area_level_1') {
                formattedAddressData.state = element.long_name;
            } else if (type === 'postal_code') {
                formattedAddressData.postal_code = element.long_name;
            }
        });
    });
    return formattedAddressData;
}


