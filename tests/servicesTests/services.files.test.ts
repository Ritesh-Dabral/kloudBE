/**
 * Tests the files services, uses aws
 * 
 */

 import FileServices from '../../src/services/files';
//  import Config from '../config/testIndex';
//  import mongoose from 'mongoose';
 import {UserModel} from '../../src/models/user';
 import {FileModel} from '../../src/models/files';
 import {randomBytes} from 'crypto'

 export const FilesTests =  () => {
    
    // an object of LocalServices
    const tstFleSrvceObj = new FileServices();
    let verifiedUser,fileDataReceived;

    /**
     * SETUP A MOCK DB TO CHECK THE WORKING OF 
     * SERVICES (if required)
     * 
     * create a verified and unverified user
     * 
     */

    beforeAll( async()=>{
        verifiedUser = await UserModel.find({email:'xyz@gmail.com'})
     });


     describe(' ADD FILES SERVICES', ()=>{
         const files = {
             'myFiles': [
                 {
                    originalname:'file1.txt',
                    mimetype:'text/plain',
                    size:1200,
                    buffer: randomBytes(32),
                 }
             ]
         }

         it('Uploads file to S3 as well as add details to DB', async()=>{
             fileDataReceived = await tstFleSrvceObj.addFiles(files,verifiedUser[0]._id,20);

             expect(fileDataReceived.length).toBe(1);
             expect(fileDataReceived[0]['url']).not.toBeUndefined();
             expect(fileDataReceived[0]['ACL']).toEqual('private');
             
             verifiedUser = await UserModel.findById(verifiedUser[0]._id);
             expect(verifiedUser['storage']).not.toEqual(20);
         })

     })


     describe('✅ TOGGLE SHAREABLE MODE SERVICE', ()=>{

        it('Changes ACL value and makes file public or private', async()=>{
            await tstFleSrvceObj.toggleShareable(fileDataReceived[0]['fileKey'],true);
            let updatedACL = await FileModel.find({"fileKey":fileDataReceived[0]['fileKey']});
            expect(updatedACL[0]['ACL']).toEqual('public-read');

            await tstFleSrvceObj.toggleShareable(fileDataReceived[0]['fileKey'],false);
            updatedACL = await FileModel.find({"fileKey":fileDataReceived[0]['fileKey']});
            expect(updatedACL[0]['ACL']).toEqual('private');
        })
    })


    describe('✅ VIEW FILES SERVICE', ()=>{

        it('Fetch file details related to the user', async()=>{
            let filesRec = await tstFleSrvceObj.viewFiles(verifiedUser['_id']);
            expect(filesRec.length).toBe(1);
        })
    })

    describe('✅ DELETE FILES SERVICE', ()=>{

        it('Delete a file from S3 as well as DB', async()=>{
            await tstFleSrvceObj.deleteFiles(fileDataReceived[0]['fileKey'],verifiedUser['_id'],verifiedUser['storage']);
            verifiedUser = await UserModel.findById(verifiedUser._id);
            let userfiles = await FileModel.find({"uid":verifiedUser['_id']});
            expect(userfiles.length).toBe(0);
        })
    })

 }
 