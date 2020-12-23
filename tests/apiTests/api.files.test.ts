/**
 * Local auth api testing
 * 
 * here we have access to verified user's accessToken
 * and 
 * unverified user's accessToken
 */

 import request from 'supertest';
 import express from 'express';
 import ExpressLoader from '../../src/loaders/express';
 import {userTokens} from './api.localauth.test';
 import path from 'path';

const app = express();

export const FilesApiTests = ()=>{
    
    let fileKey='';
    let fileId='';

    beforeAll(()=>{
        ExpressLoader({app});
    })


   /**
    * 
    * ADD FILES
    * 
    */

   it('POST /api/files/add  used by verified user (success)', (done)=>{
    const filePath = path.join(__dirname,'..','/testFile.txt');
        request(app).post('/api/files/add')
        .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
        .attach('myFiles',filePath)
        .expect(201)
        .then(res=>{
            const {msg,data} =res.body;
            fileKey = data[0]['fileKey'];
            expect(data.length).toBe(1);
            expect(data[0]['url']).not.toBeUndefined();
            expect(msg).toEqual('Addition Successful');
            done();
        })
   })

   it('POST /api/files/add  used by unverified user (forbiddenAccess)', (done)=>{
    const filePath = path.join(__dirname,'..','..','tests/testFile.txt');
        request(app).post('/api/files/add')
        .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
        .attach('myFiles',filePath)
        .expect(403)
        .then(res=>{
            const {errors} = res.body;
            expect(errors).not.toBeNull();
            expect(errors['message']).toEqual('Please verify yourself before accessing these features');
            done();
        })
   })




   /**
    * SHAREABLE
    * 
    */
   it('POST /api/files/shareable  used by verified user (success)', (done)=>{
        request(app).post('/api/files/shareable')
        .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
        .send({
            "fileKey":fileKey,
            "shareable":true
        })
        .expect(201)
        .then(res=>{
            const {msg,data} =res.body;
            expect(data).not.toBeUndefined();
            expect(msg).toEqual('Sharable toggle successful');
            done();
        })
   })


   it('POST /api/files/shareable  used by unverified user (forbiddenAccess)', (done)=>{
        request(app).post('/api/files/shareable')
        .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
        .send({
            "fileKey":fileKey,
            "shareable":true
        })
        .expect(403)
        .then(res=>{
            const {errors} = res.body;
            expect(errors).not.toBeNull();
            expect(errors['message']).toEqual('Please verify yourself before accessing these features');
            done();
        })
    })


    /**
    * ALL FILES
    * 
    */
   it('GET /api/files/allfiles  used by verified user (success)', (done)=>{
        request(app).get('/api/files/allfiles')
        .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
        .expect(200)
        .then(res=>{
            fileId=res.body.files[0]['_id'];
            const {message,files} =res.body;
            expect(files.length).toBe(1);
            expect(message).toEqual('File fetched successfully');
            done();
        })
    })

    it('GET /api/files/allfiles  used by unverified user (forbiddenAccess)', (done)=>{
        request(app).get('/api/files/allfiles')
        .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
        .expect(403)
        .then(res=>{
            const {errors} = res.body;
            expect(errors).not.toBeNull();
            expect(errors['message']).toEqual('Please verify yourself before accessing these features');
            done();
        })
    })


    /**
     * 
     * Download
     * 
     */

    it('POST /api/files/download  used by verified user (success)', (done)=>{
        
        request(app).post('/api/files/download')
        .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
        .send({
            "fileId":fileKey.split('/')[0],
            "fileKey":fileKey.split('/')[1]
        })
        .then(res=>{
            let attchmntName = `attachment; filename="${fileKey.split('/')[1]}"`
            expect(res.header['content-disposition']).toEqual(attchmntName);
            done();
        })
    })

    it('POST /api/files/download used by unverified user (forbiddenAccess)', (done)=>{
        
        request(app).post('/api/files/download')
        .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
        .send({
            "fileId":fileKey.split('/')[0],
            "fileKey":fileKey.split('/')[1]
        })
        .then(res=>{
            const {errors} = res.body;
            expect(errors).not.toBeNull();
            expect(errors['message']).toEqual('Please verify yourself before accessing these features');
            done();
        })
    })

    
    /**
     * 
     * DELETE FILE(S)
     * 
     */

    it('POST /api/files/delete  used by verified user (success)', (done)=>{
        
        request(app).post('/api/files/delete')
        .set('authorization',`Token ${userTokens.verifiedUser.accessToken}`)
        .send({
            "fileKey":fileKey
        })
        .expect(201)
        .then(res=>{
            const {msg} =res.body;
            expect(msg).toEqual('Deletion Successful');
            done();
        })
    })

    it('POST /api/files/delete used by unverified user (forbiddenAccess)', (done)=>{
        
        request(app).post('/api/files/delete')
        .set('authorization',`Token ${userTokens.unverifiedUser.accessToken}`)
        .send({
            "fileKey":fileKey
        })
        .expect(403)
        .then(res=>{
            const {errors} = res.body;
            expect(errors).not.toBeNull();
            expect(errors['message']).toEqual('Please verify yourself before accessing these features');
            done();
        })
    })

}