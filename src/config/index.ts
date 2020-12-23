/**
 * 
 */
    import dotenv from 'dotenv';
    // Set the NODE_ENV to 'development' by default
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    const envFound = dotenv.config();


    export async function loadEnvFile(){
        if(!envFound){
            console.error('Could not find .env file');
        }
    }

 const config = {
    NODE_ENV : process.env.NODE_ENV || 'development',

    PORT : process.env.PORT || 5000,

    logs:{
        level: (process.env.NODE_ENV!=='test')?(process.env.LOG_LEVEL|| 'silly'):('silent') ,
    },

    mongoDB:{
        URI:(process.env.NODE_ENV!=='test')?(process.env.MONGO_DB_URI):('why so serious?'),
    },

    jwt:{
        secret:process.env.JWT_TOKEN_SECRET
    },

    aws:{
        accessKeyId:process.env.AWS_S3_accessKeyId,
        secretAccessKey:process.env.AWS_S3_secretAccessKey,
        bucketName: (process.env.NODE_ENV!=='test')?(process.env.Bucket_name):(`${process.env.Bucket_name}tests`),
        region: process.env.Region,
        bucketLink:process.env.Bucket_link
    },

    sendGrid:{
        apiKey:process.env.SENDGRID_API,
        template:{
            verification:process.env.SEND_GRID_WELCOME_TEMPLATE
        }
    },

    URL_prefix:process.env.URL_PREFIX,

    FE_URL_HOMEPAGE: process.env.FE_URL_HOMEPAGE

 }

 export default config;