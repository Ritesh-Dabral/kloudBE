/**
 * Verification Mail Tests
 * 
 */

 import {VerifMailModel} from '../../src/models/verificationMail';
 import {UserModel} from '../../src/models/user';

 export const VerifMailTests = ()=>{

    let tempUser;
    const tempMailDet={
        "uid":'',
        "uuid":'12345678'
    };
    let newTempMail;

    beforeAll( async()=>{
        tempUser = await UserModel.findOne({"email":'modeltester1@gmail.com'});
        // add uid field to fileDet

        tempMailDet["uid"] = tempUser['_id'];
    })

    it('Creates a new verification document', async()=>{
        newTempMail = await VerifMailModel.create(tempMailDet);
       expect(newTempMail['_id']).not.toBeNull();
    })

    /**
     * UID TESTS
     * 
     */

    it(`Doesn't create verification doc with empty uid`, async()=>{
        try {
            newTempMail = await VerifMailModel.create({
                ...tempMailDet,
                "uid":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create verification doc with invalid uid after casting`, async()=>{
        try {
            newTempMail = await VerifMailModel.create({
                ...tempMailDet,
                "uid":'asas'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * UUID TEST
     * 
     */

    it(`Doesn't create verification doc with empty uuid`, async()=>{
        try {
            newTempMail = await VerifMailModel.create({
                ...tempMailDet,
                "uuid":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

 };