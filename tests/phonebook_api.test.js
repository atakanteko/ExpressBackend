const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const PhoneBook = require('../models/phonebook');

const initialDatas = [
    {
        name:"Mert Kahraman",
        phone:"0 532 563 1278"
    },
    {
        name:"Ecem Aksaz",
        phone:"0 555 624 8314"
    }
]

beforeEach(async () => {
    await PhoneBook.deleteMany({})
    let phoneObject = new PhoneBook(initialDatas[0])
    await phoneObject.save()
    phoneObject = new PhoneBook(initialDatas[1])
    await phoneObject.save()
  })

test('notes are returned as json', async () => {
  await api.get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All content are returned', async ()=>{
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(initialDatas.length)
})

test('a specific note is within the returned content', async () => {
    const response = await api.get('/api/persons')
  
    const contents = response.body.map(r => r.name)
    expect(contents).toContain(
      'Ecem Aksaz'
    )
  })


test('the first name is Mert Kahraman', async () => {
    const response = await api.get('/api/persons')
  
    expect(response.body[0].name).toBe('Mert Kahraman')
  })

afterAll(() => {
  mongoose.connection.close()
})