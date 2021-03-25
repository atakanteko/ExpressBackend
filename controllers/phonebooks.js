const phonebookRouter = require('express').Router()
const PhoneBook = require('../models/phonebook');
const User = require('../models/user')

//! get all
phonebookRouter.get('/',async (request,response) => {
    const result = await PhoneBook.find({})
    response.json(result)
    /*PhoneBook.find({})
    .then((result) => {
        response.json(result);
    })
    .catch((error) => {
        console.log("Error:",error)
    })*/
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
phonebookRouter.post('/', async (request,response,next) => {
    console.log(request)
    const body = request.body


    if(!body.phone || !body.name){
        return response.status(400).json({
            error:'phone or name field is missing'
        })
    }
    
    const user = await User.findById(body.userId)
    console.log("That user:", user)

    const person = new PhoneBook({
        name:body.name,
        phone: body.phone,
        user:user._id
    })
    try {
        
        const result = await person.save()
        user.phonebooks = user.phonebooks.concat(result._id)
        await user.save()
        //const savedPersons = await result.toJSON()
        
        //response.status(200)
        response.json(result)
        //response.end()
    } catch (exception) {
        next(exception)
    }
    

    /*
    person
        .save()
        .then((savedPersonPhone) => {

        return savedPersonPhone.toJSON()
            })
        .then((savedAndFormattedPersonPhone) => {
        response.status(200)
        response.json(savedAndFormattedPersonPhone)
        response.end()
            })
        .catch(error =>next(error))
        //!Next error handling için kullanıldı.
        */
})

//! delete the record by identified id
phonebookRouter.delete('/:id',async (request,response,next) => {
        
        
        try {
            const result = await PhoneBook.findOneAndRemove({_id:request.params.id})
            console.log("Result:",result)
            response.status(204).end()
        } catch (exception) {
            next(exception)
        }

        /*
        PhoneBook.findOneAndRemove({_id:request.params.id})
        .then(item =>{
            response.json(item)
        })
        .catch((error) => {
            console.log("Error:",error)
        })*/
})

module.exports = phonebookRouter