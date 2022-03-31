let envPath = __dirname + "/../.env"
require('dotenv').config({path:envPath});
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../Users');
chai.should();

chai.use(chaiHttp);

describe('Register, Login and Call Movie with Basic Auth and JWT Auth', () => {
    beforeEach((done) => {
        //db.userList = [];
        done();
    })

    after((done) => { //after this test suite empty the database
        //db.userList =[];
        User.deleteOne({name: 'test'}, function(err, user) {
            if (err) throw err;
        });
        done();
    })

    describe('/signup', () => {
        it('it should register, login and check our token', (done) => {
            chai.request(server)
                .post('/signup')
                .send(login_details)
                .end((err, res) => {
                    console.log(JSON.stringify(res.body));
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    //follow-up to get the JWT takon
                    chai.request(server)
                        .post('/signin')
                        .send(login_details)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('token');

                            let token = res.body.token;
                            console.log(token);
                            done();

                        })
                })
        })
    });
});