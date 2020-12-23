/**
 * Single point to export all middlewares
 */

 import isAuth from './isAuth';
 import getCurrentUser from './getCurrentUser';
 import isVerified from './isVerified';
 import validateUploads from './validatingUpload';

 
 export default {
   isAuth,
   getCurrentUser,
   isVerified,
   validateUploads
}