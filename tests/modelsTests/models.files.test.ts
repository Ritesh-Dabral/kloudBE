/**
 * Files Model Tests
 * 
 */

 import {FileModel} from '../../src/models/files';
 import { UserModel } from '../../src/models/user';
 import {randomBytes} from 'crypto';


 export const FilesModelTests =  ()=>{

    let tempFile,tempUser;

    let fileDet = {
        "uid":'', // will be filled during test
        "fileKey":randomBytes(32).toString('hex'),
        "url":`https://www.filetester.com/${randomBytes(40).toString('hex')}`,
        "originalname":'myfile.txt',
        "contentType":'text/plain',
        "ACL":'private',
        "size":12 //in Mb

    }
    /**
     * At this point we will have a user 
     * 
     */

     beforeAll( async()=>{
         tempUser = await UserModel.findOne({"email":'modeltester1@gmail.com'});
         // add uid field to fileDet

         fileDet['uid'] = tempUser['_id'];
     })

     it('Creates a new file document', async()=>{
        tempFile = await FileModel.create(fileDet);

        expect(tempFile['_id']).not.toBeUndefined();
     })


     /**
      * UID INPUT TESTS
      * 
      */
     it(`Doesn't create file with empty uid`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "uid":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with invalid uid after casting`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "uid":'1234abcd'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })
    

    /**
     * 
     * FILE KEY TESTS
     * 
     */

    it(`Doesn't create file with empty fileKey`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "fileKey":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with not unique fileKey`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * 
     * URL TESTS
     * 
     */

    it(`Doesn't create file with empty url field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "url":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with not unique url field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                fileKey:randomBytes(32).toString('hex')
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    /**
     * ORIGINAL NAME
     * 
     */

    it(`Doesn't create file with empty original name field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "originalname":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with original name without extension`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "originalname":'myFile'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    /**
     * 
     * CONTENT TYPE
     * 
     */

    it(`Doesn't create file with empty content type`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "contentType":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with invalid content type`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "contentType":'image'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * ACL TESTS
     * 
     */

    it(`Doesn't create file with empty ACL field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "ACL":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with invalid ACL field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "ACL":'anything'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * SIZE TEST
     */

    it(`Doesn't create file with empty size field`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "size":'',
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with file size 0`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "size":0,
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with file size more than 20Mb`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "size":21,
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create file with invalid file size after casting`, async()=>{
        try {
            tempFile = await FileModel.create({
                ...fileDet,
                "size":'21x',
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })
 }
