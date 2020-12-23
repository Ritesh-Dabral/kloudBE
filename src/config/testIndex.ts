/**
 * 
 */
import dotenv from 'dotenv';

// Set the NODE_ENV to 'test' by default
process.env.NODE_ENV = 'test';

const envFound = dotenv.config();


export async function loadEnvFile(){
    if(!envFound){
        console.error('Could not find .env file');
    }
}

const config = {

    NODE_ENV : process.env.NODE_ENV || 'test',

    PORT : process.env.PORT || 5000,

    mongoDB:{
        URI:`${process.env.MONGO_DB_URI}_test`
    },

}

export default config;