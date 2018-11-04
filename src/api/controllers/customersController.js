import Customer from '../models/customers';
import axios from 'axios';

export const getCustomerAddress = (pageID, userID) => {
    let addressData = {};

    const customer = Customer.findOne({ pageId: pageID, userId: userID }).exec();

    if (customer) {
        addressData.formattedAddress = customer.addr_formatted;
        addressData.street = customer.addr_street;
        addressData.street_number = customer.addr_streetnumber;
        addressData.sublocality = customer.addr_sublocality;
        addressData.state = customer.addr_state;
        addressData.city = customer.addr_city;
        addressData.postal_code = customer.addr_postalcode;
    }

    return addressData;
}

export const getAddressLocation = (location) => {
    let addressData = {};

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            'latlng': location.lat + ',' + location.long,
            'key': process.env.GOOGLE_MAPS_APIKEY,
        }
    });

    addressData.status = response.status;

    if (response.status === 'OK') {
        addressData.formattedAddress = response.results[0].formatted_address;
        const addComps = response.results[0].address_components;

        addComps.forEach(element => {
            element.types.forEach(type => {
                if (type === 'street_number') {
                    addressData.street_number = element.long_name;
                } else if (type === 'route') {
                    addressData.street = element.long_name;
                } else if (type === 'sublocality' || type === 'sublocality_level_1') {
                    addressData.sublocality = element.long_name;
                } else if (type === 'administrative_area_level_2') {
                    addressData.city = element.long_name;
                } else if (type === 'administrative_area_level_1') {
                    addressData.state = element.long_name;
                } else if (type === 'postal_code') {
                    addressData.postal_code = element.long_name;
                }
            });
        });
    }
    return addressData;
}

export const customer_update = (custData) => {

    const customer = Customer.findOne({ pageId: custData.pageId, userId: custData.userId }).exec();

    if (customer) {
        if (custData.location) {
            customer.location_lat = custData.location.lat;
            customer.location_long = custData.location.long;
            customer.location_url = custData.location.url;
        }
        if (custData.addr) {
            customer.addr_formatted = custData.addr.formattedAddress;
            customer.addr_street = custData.addr.street;
            customer.addr_sublocality = custData.addr.sublocality;
            customer.addr_streetnumber = custData.addr.street_number;
            customer.addr_state = custData.addr.state;
            customer.addr_city = custData.addr.city;
            customer.addr_postalcode = custData.addr.postal_code;
        }
        customer.save();
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
            name: custData.name,
            email: custData.email,
            phone: custData.phone,
            addr_formatted: custData.addr ? custData.addr.formattedAddress : null,
            addr_street: custData.addr ? custData.addr.street : null,
            addr_sublocality: custData.addr ? custData.addr.sublocality : null,
            addr_streetnumber: custData.addr ? custData.addr.street_number : null,
            addr_state: custData.addr ? custData.addr.state : null,
            addr_city: custData.addr ? custData.addr.city : null,
            addr_postalcode: custData.addr ? custData.addr.postal_code : null,
            pictureUrl: custData.pictureUrl,
            location_lat: custData.location ? custData.location.lat : null,
            location_long: custData.location ? custData.location.long : null,
            location_url: custData.location ? custData.location.url : null,
        });
    }
}


