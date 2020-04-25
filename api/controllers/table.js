'use strict';

const ObjectId = require('mongodb').ObjectId;
const DataFixer = require('../helpers/data_fixer');

module.exports = {
  createTables,
  deleteTablesByPlace,
  getTable,
  getTablesByPlace,
};

async function createTables(req, res) {
  let tables = req.swagger.params.tables.value;
  try {
    await req.db.collection('table').insert(tables);
    res.json({ success: true, message: 'sikeres feltöltés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function deleteTablesByPlace(req, res) {
  let placeId = req.swagger.params.placeId.value;
  try {
    await req.db.collection('table').deleteMany({ placeId: placeId });
    res.json({ success: true, message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getTable(req, res) {
  let id = req.swagger.params.id.value;
  try {
    res.json(DataFixer.replacePrivateId(await req.db.collection('table').findOne({ _id: ObjectId(id) })));
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getTablesByPlace(req, res) {
  let placeId = req.swagger.params.placeId.value;
  try {
    res.json(
      DataFixer.replacePrivateId(
        await req.db
          .collection('table')
          .find({ placeId: placeId })
          .toArray()
      )
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}
