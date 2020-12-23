# ***`KloudStorage BE`***
Application to upload, manage ,delete and download files along with making the links public or private with user authentication and error handling. 
Consists of tests which can be run before the actual server.
Fueled by node and express

## Requirements
  * NodeJS (curr ver - 12)
  * MongoDB (if running locally)
  * Postman (to test the APIs)

## Scripts
The project consists of well written and easily understandable test cases and descriptions.
#### `npm start` : This starts the project in development mode
#### `npm test -- models.index.test.ts` : This tests the models
#### `npm test -- services.index.test.ts` : This tests the services
#### `npm test -- api.index.test.ts` : This tests the APIs

## Important
* Make sure to fill the *.env* file with your *own keys*
* Make sure to create two Amazon S3 Buckets with name 
  - <YOUR_BUCKET_NAME> 
  - <YOUR_BUCKET_NAME`tests`>

## Steps
1. run command `git clone https://github.com/Ritesh-Dabral/cloud-storage-BE.git`
2. Within the root directory, run command `npm install`
3. Make sure to include environment file along with your API KEYs
4. Run the tests to make sure everything is working fine
   - I haven't merged the tests so that they can be analysed separately
5. If all test cases passed, run command `npm start` from root directory
