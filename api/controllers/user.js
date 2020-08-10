'use strict';

const ObjectId = require('mongodb').ObjectId;
const DataFixer = require('../helpers/data_fixer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  loginUser,
};

async function createUser(req, res) {
  let user = req.swagger.params.user.value;
  try {
    const dbresult = await req.db.collection('user').findOne({ email: user.email });
    if (dbresult) {
      res.status(409).json({ message: 'Email cím már használt' });
    }
    await bcrypt.hash(user.password, parseInt(process.env.PASSWORD_SALT)).then((hashedPass) => {
      user.password = hashedPass;
    });
    await req.db.collection('user').insertOne(user);
    res.status(201).json({ message: 'sikeres feltöltés' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function updateUser(req, res) {
  let id = req.auth.id;
  let user = req.swagger.params.user.value;
  try {
    delete user.id;
    if (user.password) {
      await bcrypt.hash(user.password, parseInt(process.env.PASSWORD_SALT)).then((hashedPass) => {
        user.password = hashedPass;
      });
    }
    await req.db.collection('user').updateOne({ _id: ObjectId(id) }, { $set: user });
    res.status(200).json({ message: 'sikeres változtatás' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function deleteUser(req, res) {
  let id = req.auth.id;
  let password = req.swagger.params.password.value;
  try {
    const dbresult = await req.db.collection('user').findOne({ _id: ObjectId(id) });
    if (await bcrypt.compare(password, dbresult.password)) {
      await req.db.collection('user').deleteOne({ _id: ObjectId(id) });
      res.status(200).json({ message: 'sikeres törlés' });
    } else {
      throw new Error('Rossz jelszó');
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getUser(req, res) {
  let id = req.swagger.params.id.value;
  try {
    let dbresult = DataFixer.replacePrivateId(await req.db.collection('user').findOne({ _id: ObjectId(id) }));
    delete dbresult.password;
    res.status(200).json(dbresult);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function loginUser(req, res) {
  let email = req.swagger.params.auth.value.email;
  let password = req.swagger.params.auth.value.password;
  try {
    let dbresult = DataFixer.replacePrivateId(await req.db.collection('user').findOne({ email: email }));
    if (await bcrypt.compare(password, dbresult.password)) {
      const token = jwt.sign({ id: dbresult.id, email: dbresult.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.status(200).json({ token: token, user: { id: dbresult.id, name: dbresult.name, email: dbresult.email } });
    } else {
      throw new Error('Rossz jelszó');
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
