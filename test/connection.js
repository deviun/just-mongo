const { expect } = require('chai');
const Connection = require('../src/Connection');

describe('test connections', () => {
  it('create connection without params', () => {
    const { connectionURI } = new Connection({});

    expect(connectionURI).eq('mongodb://localhost:27017/');
  });

  it('create connection with db', () => {
    const { connectionURI } = new Connection({ db: 'name' });

    expect(connectionURI).eq('mongodb://localhost:27017/name');
  });

  it('create connection with username and password', () => {
    const { connectionURI } = new Connection({
      user: 'admin',
      password: 'qwerty'
    });

    expect(connectionURI).eq('mongodb://admin:qwerty@localhost:27017/');
  });
});
