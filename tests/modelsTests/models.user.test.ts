/**
 * User Model Tests
 * 
 */

 import {UserModel} from '../../src/models/user';
 import {randomBytes} from 'crypto';

 export const UserModelTests =  ()=>{

    let tempUser;
    
    let userDet = {
        "email":'modeltester1@gmail.com',
        "password":'12345678',
        "profile_image":'',
        "storage":20,
        "username":'modeltester',
        "verified":false
    }

    it('Creates a new user', async()=>{
        tempUser = await UserModel.create(userDet);

        expect(tempUser['_id']).not.toBeUndefined();
    })

    /**
     * EMAIL INPUT TESTS
     * 
     */
    it(`Doesn't create user with same email`, async()=>{
        try {
            tempUser = await UserModel.create(userDet);
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with empty email`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "email":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with invalid email`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "email":'abcd'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })



    /**
     * PASSWORD INPUT TESTS
     * 
     */

    it(`Doesn't create user with empty password`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "password":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    it(`Doesn't create user with password less than 8 characters`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "password":'123456'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * USERNAME TEST 
     * 
     */

    it(`Doesn't create user with empty username`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "username":''
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with username less than 3 characters`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "username":'ab'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with username more than 200 characters`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "username": randomBytes(201).toString('hex')
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with username consisting of only spaces`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "username":'      '
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * STORAGE TEST 
     * 
     */

    it(`Doesn't create user with storage less than 0`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "storage":-3
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with storage more than 20`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "storage":21
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

    it(`Doesn't create user with storage type other than a Number after casting`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "storage":'21x'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })


    /**
     * VERIFIED TEST 
     * 
     */

    it(`Doesn't create user with verified status not of type Boolean after casting`, async()=>{
        try {
            tempUser = await UserModel.create({
                ...userDet,
                "verified":'trues'
            });
        } catch (e) {
            expect(e).not.toBeNull();
        }
    })

 }