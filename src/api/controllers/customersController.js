import Customer from '../models/customers';
import axios from 'axios';
import util from 'util';
import stringCapitalizeName from 'string-capitalize-name';
import { shuffle } from '../util/util';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';
import { getOrdersCustomerStat } from './ordersController';
// import { emitEvent } from './redisController';

// List all customers
export const customer_get_all = async (req, res) => {
  try {
    // Getting the sort from the requisition
    let sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    let rangeObj = configRangeQuery(req.query.range);

    let queryObj = {};
    if (req.query.filter) {
      const filterObj = configFilterQueryMultiple(req.query.filter);

      if (filterObj && filterObj.filterField && filterObj.filterField.length) {
        for (let i = 0; i < filterObj.filterField.length; i++) {
          const filter = filterObj.filterField[i];
          const value = filterObj.filterValues[i];
          if (Array.isArray(value)) {
            queryObj[filter] = { $in: value };
          }
          else
            queryObj[filter] = value;
        }
      }
    }
    if (req.currentUser.activePage) {
      queryObj["pageId"] = req.currentUser.activePage;
    }

    Customer.find(queryObj).sort(sortObj).exec((err, result) => {
      if (err) {
        res.status(500).json({ message: err.errmsg });
      } else {
        let _rangeIni = 0;
        let _rangeEnd = result.length;
        if (rangeObj) {
          _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
          _rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
        }
        let _totalCount = result.length;
        let resultArray = new Array();
        for (let i = _rangeIni; i < _rangeEnd; i++) {
          resultArray.push(result[i])
        }

        res.setHeader('Content-Range', util.format("customers %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
        res.status(200).json(resultArray);
      }
    });
  } catch (customerGetAllErr) {
    console.error({ customerGetAllErr });
    res.status(500).json({ message: err.message });
  }
};

// List one record by filtering by ID
export const customer_get_one = async (req, res) => {
  if (req.params && req.params.id) {
    try {
      const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
      const customerId = req.params.id;

      let queryParams = {};
      queryParams['id'] = customerId;
      if (pageId) {
        queryParams['pageId'] = pageId;
      }

      const customer = await Customer.findOne(queryParams).exec();
      if (customer) {
        const { total_spent, nb_orders, first_order, last_order } = await getOrdersCustomerStat({ pageId, customerId });

        const jsonCustomer = {
          id: customer.id,
          pageId: customer.pageId,
          first_name: customer.first_name,
          last_name: customer.last_name,
          profile_pic: customer.profile_pic,
          phone: customer.phone,
          addr_formatted: customer.addr_formatted,
          addr_city: customer.addr_city,
          addr_postalcode: customer.addr_postalcode,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
          total_spent: total_spent,
          nb_orders: nb_orders,
          first_order: first_order,
          last_order: last_order,
        };

        res.status(200).json(jsonCustomer);
      } else {
        res.status(500).json({ message: 'pos.customer.messages.no_customer_found' });
      }
    } catch (customerGetOneError) {
      res.status(500).json({ message: customerGetOneError.message });
    }
  }
}

export const customer_update = (req, res) => {
  if (req.body && req.body.id) {
    const pageId = req.currentUser.activePage;

    Customer.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
      if (!err) {
        doc.first_name = stringCapitalizeName(req.body.first_name);
        doc.last_name = stringCapitalizeName(req.body.last_name);
        doc.addr_city = stringCapitalizeName(req.body.city);
        doc.addr_postalcode = req.body.addr_postalcode;
        doc.save((err, result) => {
          if (err) {
            res.status(500).json({ message: err.errmsg });
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(500).json({ message: err.errmsg });
      }
    });
  }
}


/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */
export const deleteManyCustomers = async (pageID) => {
  return await Customer.deleteMany({ pageId: pageID }).exec();
}


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

export const getCustomerById = async (pageID, id) => {
  return await Customer.findOne({ pageId: pageID, id: id }).exec();
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
      addressData.location_lat = customer.location_lat;
      addressData.location_long = customer.location_long;
      return addressData;
    } else return null;
  } else return null;
}

export const getAddressLocation = async (location) => {
  let arr = [1, 2, 3, 4];
  arr = shuffle(arr); // select the apis randomically

  const response = await googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[0]]);
  console.info({ response });
  if (response.status === 200) {
    if (response.data.error_message && response.data.status === 'OVER_QUERY_LIMIT') {
      const response2 = await googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[1]]);
      if (response2.status === 200) {
        if (response2.data.error_message && response2.data.status === 'OVER_QUERY_LIMIT') {
          const response3 = await googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[2]]);
          if (response3.status === 200) {
            if (response3.data.error_message && response3.data.status === 'OVER_QUERY_LIMIT') {
              const response4 = await googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[3]]);
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
      latlng: location.lat + ',' + location.long,
      key: API_KEY,
    }
  });
}

export const updateCustomer = async (custData) => {
  const customer = await Customer.findOne({ pageId: custData.pageId, userId: custData.userId }).exec();

  if (customer && customer.id) {
    const { first_name, last_name, phone, profile_pic, location, addrData } = custData;

    let updateDb = false;
    if (first_name || last_name || profile_pic) {
      customer.first_name = first_name;
      customer.last_name = last_name;
      customer.profile_pic = profile_pic;
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
      await customer.save();
    }
    return customer;
  } else {
    const resultLastId = await Customer.find({ pageId: custData.pageId })
      .select('id')
      .sort('-id')
      .limit(1)
      .exec();
    let lastId = 1;
    if (resultLastId && resultLastId.length) lastId = resultLastId[0].id + 1;

    const newRecord = new Customer({
      id: lastId,
      userId: custData.userId,
      pageId: custData.pageId,
      first_name: custData.first_name,
      last_name: custData.last_name,
      profile_pic: custData.profile_pic,
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

    await newRecord.save();
    return newRecord;
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

// /**
//  * Using Redis, communicate with server-webapp
//  * @param {*} pageId
//  * @param {*} userId
//  * @param {*} user
//  */
// export const notifyUserStopAuto = async (pageId, userId, user) => {
//   try {
//     const formattedUserId = userId.indexOf('@') > -1 ? userId.split('@')[0] : userId;

//     const data = { id: formattedUserId, first_name: user.first_name }
//     emitEvent(pageId, 'talk-to-human', data);
//   } catch (error) {
//     console.error(error);
//   }
// }


