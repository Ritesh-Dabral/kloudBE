/**
 * 
 */

 import testRoutes from './routes/testing';
 import localAuthRoutes from './routes/localAuth';
 import filesRoutes from './routes/files';
 import homeRoute from './routes/home';
 import googleRoute from './routes/googleAuth';

 import {Router} from 'express';

 export default ()=>{
     const app = Router();

     testRoutes(app);
     localAuthRoutes(app);
     filesRoutes(app);
     homeRoute(app);
     googleRoute(app);
     
     return app;
 }