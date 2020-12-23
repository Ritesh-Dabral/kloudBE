/**
 * All api tests
 * 
 */

 import express from 'express';
 import mongoose from 'mongoose';
 import Config from '../../src/config/testIndex';
 import AllModels from '../../src/models/index'
 import { FilesApiTests } from './api.files.test';
 import { HomeApiTests } from './api.home.test';
 import { LocalAuthApiTests } from './api.localauth.test';


const app = express();

describe('✅ API TESTING', ()=>{

    let verifiedUser = {
        "email":'modeltester1@gmail.com',
        "password":'$2b$10$Vs2gMD1r1tzHXB4iVk0EOOtw3bNHMjRHQrWnFekYI9mAG2/4QNQVK',
        "profile_image":'',
        "storage":20,
        "username":'modeltester',
        "verified":true
    };

    let newUser;

   beforeAll( async()=>{
       await mongoose.connect(Config.mongoDB.URI,
           { 
               useNewUrlParser: true,
               useUnifiedTopology: true, 
               useFindAndModify: false,
               useCreateIndex: true 
           }
       );

       // create a single user before hand
       newUser = await AllModels.UserModel.create(verifiedUser);
    });


    describe('✅ LOCAL AUTH API TESTING',LocalAuthApiTests);
    describe('✅ FILES API TESTING',FilesApiTests);
    describe('✅ HOME API TESTING',HomeApiTests);

         /**
     * CLEAN UP AT THE END
     */
    afterAll(async(done)=>{
       await AllModels.UserModel.deleteMany({});
       await AllModels.VerifMailModel.deleteMany({});
       await AllModels.FileModel.deleteMany({});
       mongoose.disconnect(done)
   })
});