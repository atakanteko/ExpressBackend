//!---------------------------------------------------------------------
const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;
const URL = process.env.MONGODB_URI;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PhoneSchema = new Schema({
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
/*
const phoneBook = new PhoneBook({
    name:"Atakan Tek",
    phone:"0 532 202 8310"
})

phoneBook.save().then(result => {
    console.log('phone saved!')
    mongoose.connection.close()
  })
*/
/*
PhoneBook.find({}).then((result) => {
    result.forEach(item => {
        console.log(item)
    })
    
})
*/

const PhoneBook = mongoose.model("phonebook",PhoneSchema);
//!---------------------------------------------------------------------
module.exports = PhoneBook;
