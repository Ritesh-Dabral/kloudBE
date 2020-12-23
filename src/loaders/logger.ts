/**
 * 
 */

 import winston from 'winston';
 import config from '../config/index';

 const transports = [];


if(process.env.NODE_ENV !== 'development'){
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
              )
        })
    )
}else{
    transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
          )
        })
    )
}


const LoggerInstance =  winston.createLogger({
    level:config.logs.level,
    levels:winston.config.npm.levels,
    format:winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
        winston.format.json()
    ),
    transports
})

export default LoggerInstance;