const { expect } = require('chai')
const JustMongo = require('../../')

const db = new JustMongo({
  models: {
    Users: {
      user_id: Number
    }
  },
  db: 'just-mongo-test'
})

const Users = db.collection('Users')

describe('find', () => {
  before(async () => {
    await Users.deleteMany()
    await Users.insert({ user_id: 1 })
  })

  it('find', async () => {
    const response = await Users.findOne({ user_id: 1 })

    expect(response).to.be.a('object').to.have.property('user_id')
  })
})
