/**
 * @TODO 
 * 
 * explain imports
 * 
 * allRoutes: imported form /api/routes/index.ts
 * bodyParser: parses the request body or URL queries in JSON format with specified limit
 */

 import express from 'express';
 import allRoutes from '../api/index'; 
 import bodyParser from 'body-parser';
 import cors from 'cors';
 import Config from '../config/index';

 const corsOptions = {
   origin: Config.FE_URL_HOMEPAGE,
   optionsSuccessStatus: 200,
   credentials: true,
 }

 export default ( { app } : { app: express.Application })=>{

    app.use(cors(corsOptions));

    /**
     * M I D D L E   W A R E S
     */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({limit: "10mb", extended: true, parameterLimit:50000}));


    /**
     * A L L    D E C L A R E D    R O U T E S
     */
    app.use('/api', allRoutes());


    /**
     * 404  E R R O R   H A N D L I N G
     */
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err['status'] = 404;
      next(err);
    });


    /**
     * H A N D L E   A L L    E R R O R S
     */
    app.use((err, req, res, next) => {
        
        let errorsMessage=null;
        
        // handle celebrate errors
        if(err.message.includes('celebrate')){
          err['status'] = 400;
          err.details.forEach((element,i) => {
            const errArr = Object.values(element);
            errArr.forEach((newErr,i)=>{
              if(i==1){
                const finErr = Object.values(newErr);
                errorsMessage = finErr[0].message;
              }
            });
          });
        }


        // mongoose duplicate errors
        else if(err.message.includes('E11000')){
          err['status'] = 400;
          errorsMessage = 'Email already registered. Sign In instead';
        }

        // Error 403 : forbidden
        else if(err.message.includes('E403')){
          err['status'] = 403;
          errorsMessage = 'Please verify yourself before accessing these features';
        }

        // JWT unauthorized error (401)
        else if (err.name === 'UnauthorizedError') {
          errorsMessage = 'Unauthorized Access';
        }

        // USER NOT ALLOWED THESE ROUTES,until VERIFIED
        else if(err['status']===403){
          errorsMessage = 'Access Forbidden'
        }

        // OAUTH ERROR (USER ALREADY EXISTS with LOCAL type)
        else if(err.message.includes('OAUTH')){
          err['status'] = 401;
          errorsMessage = err.message.split(':')[1];
          console.log(errorsMessage);
        }

        res.status(err.status || 500);
        res.json({
          errors: {
            message: (errorsMessage!==null)?(errorsMessage):(err.message),
          },
        });
    });
 }