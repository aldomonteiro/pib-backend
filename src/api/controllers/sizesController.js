import Size from "../models/sizes";
import util from "util";
import stringCapitalizeName from 'string-capitalize-name';
import { configSortQuery, configRangeQuery, configFilterQueryMultiple } from '../util/util';

// List all sizes
// TODO: use filters in the query req.query
export const size_get_all = async (req, res) => {
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

  Size.find(queryObj).sort(sortObj).exec((err, result) => {
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
      let sizesArray = new Array();
      for (let i = _rangeIni; i < _rangeEnd; i++) {
        sizesArray.push(result[i])
      }
      res.setHeader('Content-Range', util.format("sizes %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
      res.status(200).json(sizesArray);
    }
  });
};

// List one record by filtering by ID
export const size_get_one = (req, res) => {
  if (req.params && req.params.id) {

    const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    Size.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
      if (err) {
        res.status(500).json({ message: err.errMsg });
      }
      else {
        res.status(200).json(doc);
      }
    });
  }
}

// CREATE A NEW RECORD
export const size_create = async (req, res) => {
  if (req.body) {
    const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    let { id } = req.body;

    if (!id || id === 0) {
      const lastId = await Size.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
      id = 1;
      if (lastId && lastId.length)
        id = lastId[0].id + 1;
    }

    const newRecord = new Size({
      id: id,
      size: stringCapitalizeName(req.body.size),
      slices: req.body.slices,
      shortening: req.body.shortening,
      split: req.body.split,
      pageId: pageId,
    });

    newRecord.save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({ message: 'pos.messages.duplicatedKey' });
        } else {
          res.status(500).json({ message: err.errmsg });
        }
      });
  }
}

// UPDATE
export const size_update = (req, res) => {
  if (req.body && req.body.id) {

    const pageId = req.currentUser.activePage;

    Size.findOne({ pageId: pageId, id: req.body.id }, (err, doc) => {
      if (!err) {
        doc.size = stringCapitalizeName(req.body.size);
        doc.split = req.body.split;
        doc.slices = req.body.slices;
        doc.shortening = req.body.shortening;
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

// DELETE
export const size_delete = (req, res) => {

  const pageId = req.currentUser.activePage;

  Size.findOneAndRemove({ pageId: pageId, id: req.params.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.errmsg });
    });
};

/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */
export const deleteManySizes = async (pageID) => {
  return await Size.deleteMany({ pageId: pageID }).exec();
}

export const getSize = async (pageID, sizeID) => {
  const query = Size.findOne({ pageId: pageID, id: sizeID });
  query.select('id size  shortening split');
  return await query.exec();
}

export const getSizes = (pageID, sizeIdArray) => {
  if (sizeIdArray && sizeIdArray.length > 0)
    return Size.find({ pageId: pageID, id: sizeIdArray }).exec();
  else
    return Size.find({ pageId: pageID }).exec();
}
