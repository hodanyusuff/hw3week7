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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}

//Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: { unique: true }},
    releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
    genre: {type: string, required: true, index: {unique: true}},
    actors: {type: string, required: true, index: {unique: true}},

});

module.exports = mongoose.model('Movie', MovieSchema);


