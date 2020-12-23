/**
 * Home route testing
 * 
 */

 import request from 'supertest';
 import express from 'express';
 import ExpressLoader from '../../src/loaders/express';
 import {userTokens} from './api.localauth.test';

 const app = express();

 export const HomeApiTests = ()=>{

     beforeAll(()=>{
        ExpressLoader({app});
     })


    /**
     * STORAGE DETAILS
     */
    it('GET /api/home/storagedet', (done)=>{
        request(app).get('/api/home/storagedet')
            .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
            .expect(200)
            .then(res=>{
                const {message,storage} = res.body;
                expect(message).toEqual('Storage fetched successfully');
                expect(storage).not.toBeGreaterThan(20);
                expect(storage).not.toBeLessThan(0);
                done();
            })        
    })

    it('GET /api/home/storagedet', (done)=>{
        request(app).get('/api/home/storagedet')
            .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
            .expect(200)
            .then(res=>{
                const {message,storage} = res.body;
                expect(message).toEqual('Storage fetched successfully');
                expect(storage).not.toBeGreaterThan(20);
                expect(storage).not.toBeLessThan(0);
                done();
            })        
    })


    /**
     * VERIFIED OR NOT
     */
    it('GET /api/home/profile', (done)=>{
        request(app).get('/api/home/profile')
            .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
            .expect(200)
            .then(res=>{
                const {message,verified} = res.body;
                expect(message).toEqual('Data fetched successfully');
                expect(verified).toBeTruthy();
                done();
            })        
    })

    it('GET /api/home/profile', (done)=>{
        request(app).get('/api/home/profile')
            .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
            .expect(200)
            .then(res=>{
                const {message,verified} = res.body;
                expect(message).toEqual('Data fetched successfully');
                expect(verified).toBeFalsy();
                done();
            })        
    })


    /**
     * RESEND VERIFICATION MAIL
     */

    it('POST /api/home/resendverifmail', (done)=>{
        request(app).post('/api/home/resendverifmail')
            .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
            .expect(200)
            .then(res=>{
                const {message} = res.body;
                expect(message.includes('User Already Verified')).toBeTruthy();
                done();
            })        
    })

    it('POST /api/home/resendverifmail', (done)=>{
        request(app).post('/api/home/resendverifmail')
            .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
            .expect(500,done)     
    })
 }