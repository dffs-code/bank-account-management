const generateHashedPassword = require('../../src/utils/generateHashedPassword');

describe('Generating Hashed Password', () => {
  it('Should generate a hashed password with a string', () => {
    const finalPasswd = generateHashedPassword('password')
    console.log(finalPasswd);
    expect(finalPasswd.length).toBeGreaterThanOrEqual(8)
  })
})