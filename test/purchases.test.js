const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const request = require('supertest');
const app = require('../app.js');

describe("purchases", () => {
    it("get purchases", done => {
        request(app)
            .get('/api/purchases/anylisis')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done()
                }
                console.log(JSON.stringify(res.body))
                done();
            })
    })
})