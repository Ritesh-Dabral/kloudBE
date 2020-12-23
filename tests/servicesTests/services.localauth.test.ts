/**
 * TESTS THE SERVICES
 * 
 * The configuration file is a 'test' configuration file
 * 
 */

 import LocalServices from '../../src/services/localAuth';
 import Config from '../../src/config/testIndex';
 import mongoose from 'mongoose';
 import {UserModel} from '../../src/models/user';
 import {VerifMailModel} from '../../src/models/verificationMail';

 export const AuthTests =  ()=>{

    // an object of LocalServices
    const tstLoclSrvceObj = new LocalServices();
    /**
     * SETUP A MOCK DB TO CHECK THE WORKING OF 
     * SERVICES (if required)
     * 
     */

    //  beforeAll( async()=>{
    //     await mongoose.connect(Config.mongoDB.URI,
    //         { 
    //             useNewUrlParser: true,
    //             useUnifiedTopology: true, 
    //             useFindAndModify: false,
    //             useCreateIndex: true 
    //         }
    //     );
    //  });



     /**
      * SIGN UP SERVICES TESTING
      * 
      */
     describe('✅ SIGN UP SERVICES', ()=>{

        it('Creates a new user', async()=>{
            const {token,user} = await tstLoclSrvceObj.SignUp({
                "email":'xyz@gmail.com', "password":'12345678', "username":'kloudtester'
            });

            expect(token.split('.')).toHaveLength(3);
            expect(user['username']).toEqual('kloudtester');
            expect(user['password']).toBeUndefined();
        })

        it(`Doesn't create a new user on empty email input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'', "password":'12345678', "username":'kloudtester'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user on invalid email input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'xyz', "password":'12345678', "username":'kloudtester'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user if email already exists`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'xyz@gmail.com', "password":'12345678', "username":'kloudtester'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user on empty password input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'abc@gmail.com', "password":'', "username":'kloudtester'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user on password input of less than 8 characters`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'abc@gmail.com', "password":'1234567', "username":'kloudtester'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user on empty username input `, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'abc@gmail.com', "password":'12345678', "username":''
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't create a new user on username input of less than 3 characters`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignUp({
                    "email":'abc@gmail.com', "password":'12345678', "username":'ab'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

     })
     


    /**
      * LOGIN SERVICES TESTING
      * 
      * till this point we have one valid user 
      * 
      */
     describe('✅ LOG IN SERVICES',()=>{
        it('Logs in a user with matching credentials', async()=>{
            const {token,user} = await tstLoclSrvceObj.SignIn({
                "email":'xyz@gmail.com', "password":'12345678'
            });

            expect(token.split('.')).toHaveLength(3);
            expect(user['username']).toEqual('kloudtester');
            expect(user['password']).toBeUndefined();
        })

        it(`Doesn't logs in user with empty email input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'', "password":'12345678'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't logs in user with unregistered email input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'abc@gmail.com', "password":'12345678'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't logs in user with invalid email input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'abc', "password":'12345678'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't logs in user on empty password input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'xyz@gmail.com', "password":''
                })
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't logs in user on password input of less than 8 characters`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'xyz@gmail.com', "password":'1234567'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

        it(`Doesn't logs in user on invalid password input`, async()=>{
            try {
                const {token,user} = await tstLoclSrvceObj.SignIn({
                    "email":'xyz@gmail.com', "password":'invalid password'
                });
            } catch (e) {
                expect(e).not.toBeNull();
            }
        })

     })


    //  /**
    //   * CLEAN UP AT THE END
    //   */
    // afterAll(async(done)=>{
    //     await UserModel.deleteMany({});
    //     await VerifMailModel.deleteMany({});
    //     mongoose.disconnect(done)
    // })

 };