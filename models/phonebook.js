const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema({
    name : {
        type:String,
        minlength:5,
        required:true
    },
    phone: {
        type:String,
        minlength:11,
        required:true
    }
})

PhoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const PhoneBook = mongoose.model("phonebook",PhoneSchema);

module.exports = PhoneBook;
