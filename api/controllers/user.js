'use strict';

const ObjectId = require('mongodb').ObjectId;
const DataFixer = require('../helpers/data_fixer');

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
};

async function createUser(req, res) {
  let user = req.swagger.params.user.value;
  try {
    let dbresult = await req.db.collection('user').insertOne(user);
    res.json({ success: true, message: 'sikeres feltöltés', id: dbresult.ops[0]._id });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function updateUser(req, res) {
  let id = req.swagger.params.id.value;
  let user = req.swagger.params.user.value;
  try {
    delete user.id;
    await req.db.collection('user').updateOne({ _id: ObjectId(id) }, { $set: user });
    res.json({ success: true, message: 'sikeres változtatás' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function deleteUser(req, res) {
  let id = req.swagger.params.id.value;
  try {
    await req.db.collection('user').deleteOne({ _id: ObjectId(id) });
    res.json({ success: true, message: 'sikeres tőrlés' });
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}

async function getUser(req, res) {
  let id = req.swagger.params.id.value;
  try {
    res.json(DataFixer.replacePrivateId(await req.db.collection('user').findOne({ _id: ObjectId(id) })));
  } catch (e) {
    res.status(400);
    res.json({ success: false, message: e.message });
  }
}
