/**
 * Local auth api testing
 * 
 * verifiedUser has already been created before entering here
 * 
 * unverified user will be created here
 */

 import request from 'supertest';
 import express from 'express';
 import ExpressLoader from '../../src/loaders/express';

 const app = express();

 export const userTokens={
     verifiedUser:{
        accessToken:''
     },
     unverifiedUser:{
         accessToken:''
     }
 }

 export const LocalAuthApiTests = ()=>{

    let verifiedUser = {
        "email":'modeltester1@gmail.com',
        "password":'12345678',
    };

    let unverifiedUser={
        "email":"xyz@gmail.com",
        "password":"12345678",
        "username":"apitester1",
    }


    beforeAll(()=>{
        ExpressLoader({app});
    })
     

    /**
     * SIGNUP
     */

    it('POST /api/auth/local/signup (201)', (done)=>{
        request(app).post('/api/auth/local/signup')
        .send({
            "email":unverifiedUser.email,
            "password":unverifiedUser.password,
            "username":unverifiedUser.username,
        })
        .expect(201)
        .then(res=>{
            userTokens.unverifiedUser.accessToken = res.body.token;
            done();
        })
    
    })


    /**
     * LOGIN
     */

    it('POST /api/auth/local/signin (200)', (done)=>{
        request(app).post('/api/auth/local/signin')
        .send({
            "email":verifiedUser.email,
            "password":verifiedUser.password,
        })
        .expect(200)
        .then(res=>{
            userTokens.verifiedUser.accessToken = res.body.token;
            done();
        })
    })


 }