const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const PhoneBook = require('../models/phonebook');
const User = require('../models/user')

beforeEach(async () => {
    await PhoneBook.deleteMany({})
    let phoneObject = new PhoneBook(helper.initialDatas[0])
    await phoneObject.save()
    phoneObject = new PhoneBook(helper.initialDatas[1])
    await phoneObject.save()
})



describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api.post('/api/users')
                      .send(newUser)
                      .expect('Content-Type', /application\/json/)
                      expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


test('a phone can be deleted', async () => {
  const phoneAtStart = await helper.phonesInDb()
  const phoneToDelete = phoneAtStart[0]

  await api
    .delete(`/api/persons/${phoneToDelete.id}`)
    .expect(204)

  const phoneAtEnd = await helper.phonesInDb()

  expect(phoneAtEnd).toHaveLength(
    helper.initialDatas.length - 1
  )

  const names = phoneAtEnd.map(r => r.name)

  expect(names).not.toContain(phoneToDelete.name)
})

test('a specific phone can be viewed', async () => {
  const phonesAtStart = await helper.phonesInDb()

  const phoneToView = phonesAtStart[0]
  //console.log(phoneToView)
  const resultPhone = await api
    .get(`/api/persons/${phoneToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedPhoneToView = JSON.parse(JSON.stringify(phoneToView))

  expect(resultPhone.body).toEqual(processedPhoneToView)
})

test('a valid phone can be added', async () => {
    const newPhone = {
      name:"Mehmet Ali Hak",
      phone:"0 541 745 6333"
    }

    await api
          .post('/api/persons')
          .send(newPhone)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
    const phonesAtEnd = await helper.phonesInDb()
    const names = phonesAtEnd.map(r => r.name)
    console.log(names)
    expect(phonesAtEnd).toHaveLength(helper.initialDatas.length + 1)
    expect(names).toContain(
      'Mehmet Ali Hak'
    )
})

test('phone without content is not added', async () => {
  const newPhone = {
  }

  await api
        .post('/api/persons')
        .send(newPhone)
        .expect(400)
  
  const response = await helper.phonesInDb()
  const names = response.map(r => r.name)
  console.log(names)
  expect(response).toHaveLength(helper.initialDatas.length)
})

test('notes are returned as json', async () => {
  await api.get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All content are returned', async ()=>{
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(helper.initialDatas.length)
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