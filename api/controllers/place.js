'use strict';

const ObjectId = require('mongodb').ObjectId;
const DataFixer = require('../helpers/data_fixer');

module.exports = {
  createPlace,
  updatePlace,
  deletePlace,
  getPlace,
  getPlacesByOwner,
  getPlaces,
};

async function createPlace(req, res) {
  let place = req.swagger.params.place.value;
  try {
    let dbresult = await req.db.collection('place').insertOne(place);
    res.json({ success: true, message: 'sikeres feltöltés', id: dbresult.ops[0]._id });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function updatePlace(req, res) {
  let id = req.swagger.params.id.value;
  let place = req.swagger.params.place.value;
  try {
    delete place.id;
    await req.db.collection('place').updateOne({ _id: ObjectId(id) }, { $set: place });
    res.json({ success: true, message: 'sikeres változtatás' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function deletePlace(req, res) {
  let id = req.swagger.params.id.value;
  try {
    await req.db.collection('place').deleteOne({ _id: ObjectId(id) });
    res.json({ success: true, message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getPlace(req, res) {
  let id = req.swagger.params.id.value;
  try {
    res.json(
      DataFixer.replacePrivateId(
        await req.db.collection('place').findOne({ $or: [{ _id: ObjectId(id) }, { _id: id }] })
      )
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getPlacesByOwner(req, res) {
  let userId = req.swagger.params.userId.value;
  try {
    res.json(
      DataFixer.replacePrivateId(await req.db.collection('place').find({ ownerId: userId }).sort({ name: 1 }).toArray())
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getPlaces(req, res) {
  try {
    res.json(DataFixer.replacePrivateId(await req.db.collection('place').find().sort({ name: 1 }).toArray()));
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}
