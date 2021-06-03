const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const request = require('supertest');
const app = require('../app.js');
let data = {
    token: "tok_1IgKHkDHNiYh4mtDyLIonend", 
    products: [
        
        {
            product: "60743746ca03db136ca30eae", 
            quantity: 2, 
            toppings: [
                {topping: "olive", quantity: "with" } 
            ],
            specialAdditions: [
                {addition: "chickens", quantity: "with" } 
            ],
            size: "meduim",
            pieces: "6",
            price: 20
        }  
    ],
    adress: {
        city: "beba",
        zone: "beni madi",
        house: "about el masjed el kebeer"
    },
    amount: 72.12, 
    userId: "600963fcf792a011c87613a3", 
    recieve: "pick up" , 
    email: "ahmedhaggagrady@gmail.com",
    phone: "01014223925"
}
describe('testing orders', () => {
    it('get orders', (done) => {
        request(app)
            .get('/api/orders/')
            .set('authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY1YjllYzFkMWMwYjBhMjA1YTk3NjkiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxODY4NzkxNCwiZXhwIjoxNjE4OTQ3MTE0fQ.FzLzPePq1r3a6zfqK_7zp1eBRsoIZPjUZhVamXgobrI")
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                res.body.should.have.property('ordersLength');
                res.body.should.have.property('orders');
                res.body.orders.should.be.a("array");
                done();
            })
    });
    it("get client order", (done) => {
        request(app)
            .get('/api/orders/client/order')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                res.body.should.have.property('order')
                done();
            })
    }),
    it("add order", done => {
        request(app)
            .post('/api/orders/add/')
            .send(data)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                res.body.should.have.property("order")
                res.body.order.should.be.a("object")
                res.body.should.have.property("message")
                done();
            })
    })
    it("cancel order", done => {
        let orderId = ""
        request(app)
            .put(`/api/orders/cancel/${orderId}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                res.body.should.have.property("message")
                res.body.should.have.property("cancel").eql(true)
                done();
            })
    })
})
