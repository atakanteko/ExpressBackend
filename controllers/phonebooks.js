const phonebookRouter = require('express').Router()
const PhoneBook = require('../models/phonebook');

//! get all
phonebookRouter.get('/',(request,response) => {
    PhoneBook.find({})
    .then((result) => {
        response.json(result);
    })
    .catch((error) => {
        console.log("Error:",error)
    })
})

//! get the record by identified id
phonebookRouter.get('/:id',(request,response,next) => {
    PhoneBook.findOne({_id:request.params.id})
    .then(item =>{
        if(item){
            response.json(item)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'unknown id' })
      })
} )

//! post the record by the user
phonebookRouter.post('/',(request,response,next) => {
    const body = request.body

    if(!body.phone || !body.name){
        return response.status(404).json({
            error:'phone or name field is missing'
        })
    }
    
    const person = new PhoneBook({
        name:body.name,
        phone: body.phone
    })
    
    person
        .save()
        .then((savedPersonPhone) => {
        return savedPersonPhone.toJSON()
            })
        .then((savedAndFormattedPersonPhone) => {
        response.json(savedAndFormattedPersonPhone)
            })
        .catch(error =>next(error))
        //!Next error handling için kullanıldı.
})

//! delete the record by identified id
phonebookRouter.delete('/:id',(request,response,next) => {
        PhoneBook.findOneAndRemove({_id:request.params.id})
        .then(item =>{
            response.json(item)
        })
        .catch((error) => {
            console.log("Error:",error)
        })
})

module.exports = phonebookRouter