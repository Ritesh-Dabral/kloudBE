/**
 * express-jwt: does everything for us,
 *  from verifying the token to checking the expiry,
 *  and getting the Obj out , all
 * 
 * Config: contains the jwt secret key
 */

import expressJwt from 'express-jwt';
import Config from '../../config/index';

/**
 * 
 * @param req : get the req.headers from the request sent by client
 */
  const getTokenFromHeaderAndVerify = (req)=>{

    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
      ) {
        return req.headers.authorization.split(' ')[1];
      }
      return null;

 }

 /**
  * requestProperty: defines the property on 'req' 
  * and sends it to the next middleware, can access it using
  * req.user (contains the object stored inside token)
  */
  const isAuth = expressJwt({
      secret:Config.jwt.secret,
      requestProperty: 'user',
      getToken: getTokenFromHeaderAndVerify,
      algorithms: ['HS256']
  });
 export default isAuth;