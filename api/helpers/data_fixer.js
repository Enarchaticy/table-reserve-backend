module.exports = class DataFixer {
  // turn data(array of object or object) _id property to id
  static replacePrivateId(data) {
    if(!data){
      return {};
    }
    if (Array.isArray(data)) {
      data.map(obj => {
        obj.id = obj._id;
        delete obj._id;
      });
    } else {
      data.id = data._id;
      delete data._id;
    }
    return data;
  }
};
