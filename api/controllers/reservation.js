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
  reservation.userId = req.auth.id;
  try {
    await req.db.collection('reservation').insertOne(reservation);
    res.status(201).json({ message: 'sikeres feltöltés' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function updateReservation(req, res) {
  let id = req.swagger.params.id.value;
  let reservation = req.swagger.params.reservation.value;
  reservation.userId = req.auth.id;
  try {
    delete reservation.id;
    let dbResult = await req.db.collection('reservation').updateOne({ _id: ObjectId(id) }, { $set: reservation });
    if (dbResult.result.n == 0) {
      return res.status(400).json({ message: 'nincs ilyen foglalás(id alapján) az adatbázisban' });
    } else {
      return res.status(200).json({ message: 'sikeres módosítás' });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function deleteReservation(req, res) {
  let id = req.swagger.params.id.value;
  try {
    await req.db.collection('reservation').deleteOne({ _id: ObjectId(id) });
    res.status(200).json({ message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getReservationByDateAndTable(req, res) {
  let date = req.swagger.params.date.value;
  let tableId = req.swagger.params.tableId.value;
  let dateRegex = date.substring(0, 10) + '.*';
  try {
    res.status(200).json(
      DataFixer.replacePrivateId(
        await req.db.collection('reservation').findOne({ date: { $regex: dateRegex }, tableId: tableId })
      )
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getReservationsByDateAndPlace(req, res) {
  let date = req.swagger.params.date.value;
  let placeId = req.swagger.params.placeId.value;
  const dateRegex = date.substring(0, 10) + '.*';
  try {
    res.status(200).json(
      DataFixer.replacePrivateId(
        await req.db
          .collection('reservation')
          .find({ date: { $regex: dateRegex }, placeId: placeId })
          .toArray()
      )
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getReservationsByUser(req, res) {
  let userId = req.auth.id;
  try {
    res.status(200).json(
      DataFixer.replacePrivateId(
        await req.db.collection('reservation').find({ userId: userId }).sort({ date: -1 }).toArray()
      )
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
