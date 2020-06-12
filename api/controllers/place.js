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
  place.ownerId = req.auth.id;
  try {
    let dbresult = await req.db.collection('place').insertOne(place);
    res.status(201).json({ message: 'sikeres feltöltés', id: dbresult.ops[0]._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function updatePlace(req, res) {
  let id = req.swagger.params.id.value;
  let place = req.swagger.params.place.value;
  place.ownerId = req.auth.id;
  try {
    delete place.id;
    await req.db.collection('place').updateOne({ _id: ObjectId(id) }, { $set: place });
    res.status(200).json({ message: 'sikeres változtatás' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function deletePlace(req, res) {
  let id = req.swagger.params.id.value;
  try {
    await req.db.collection('place').deleteOne({ _id: ObjectId(id) });
    res.status(200).json({ message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getPlace(req, res) {
  let id = req.swagger.params.id.value;
  try {
    res.status(200).json(DataFixer.replacePrivateId(await req.db.collection('place').findOne({ _id: ObjectId(id) })));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getPlacesByOwner(req, res) {
  let ownerId = req.auth.id;
  console.log(ownerId);
  try {
    res
      .status(200)
      .json(
        DataFixer.replacePrivateId(
          await req.db.collection('place').find({ ownerId: ownerId }).sort({ name: 1 }).toArray()
        )
      );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getPlaces(req, res) {
  try {
    res.json(DataFixer.replacePrivateId(await req.db.collection('place').find().sort({ name: 1 }).toArray()));
  } catch (e) {
    res.status(400);
    res.json({ message: e.message });
  }
}
