'use strict';

const ObjectId = require('mongodb').ObjectId;
const DataFixer = require('../helpers/data_fixer');

module.exports = {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationByDateAndTable,
  getReservationsByDateAndPlace,
  getReservationsByUser,
};

async function createReservation(req, res) {
  let reservation = req.swagger.params.reservation.value;
  try {
    await req.db.collection('reservation').insertOne(reservation);
    res.json({ success: true, message: 'sikeres feltöltés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function updateReservation(req, res) {
  let id = req.swagger.params.id.value;
  let reservation = req.swagger.params.reservation.value;
  try {
    delete reservation.id;
    let dbResult = await req.db.collection('reservation').updateOne({ _id: ObjectId(id) }, { $set: reservation });
    if (dbResult.result.n == 0) {
      return res.json({ success: false, message: 'nincs ilyen foglalás(id alapján) az adatbázisban' });
    } else {
      return res.json({ success: true, message: 'sikeres módosítás' });
    }
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function deleteReservation(req, res) {
  let id = req.swagger.params.id.value;
  try {
    await req.db.collection('reservation').deleteOne({ _id: ObjectId(id) });
    res.json({ success: true, message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getReservationByDateAndTable(req, res) {
  let date = req.swagger.params.date.value;
  let tableId = req.swagger.params.tableId.value;
  try {
    res.json(
      DataFixer.replacePrivateId(
        await req.db.collection('reservation').findOne({ date: { $regex: '.*2020-04-14.*' }, tableId: tableId })
      )
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getReservationsByDateAndPlace(req, res) {
  let date = req.swagger.params.date.value;
  let placeId = req.swagger.params.placeId.value;
  const dateRegex = date.substring(0, 10) + '.*';
  try {
    res.json(
      DataFixer.replacePrivateId(
        await req.db
          .collection('reservation')
          .find({ date: { $regex: dateRegex }, placeId: placeId })
          .toArray()
      )
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getReservationsByUser(req, res) {
  let userId = req.swagger.params.userId.value;
  try {
    res.json(
      DataFixer.replacePrivateId(
        await req.db.collection('reservation').find({ userId: userId }).sort({ date: -1 }).toArray()
      )
    );
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}
