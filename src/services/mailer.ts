
 import {setApiKey,send} from '@sendgrid/mail'; 
 import Config from '../config/index';
 import Logger from '../loaders/logger';

const sendVerifyMail = async(email:string,verification_URL:string)=>{
    try {
        Logger.silly('✅ Verify Mail Service Invoked');
        setApiKey(Config.sendGrid.apiKey);

        
        const data = {
           to: email, //your email address
           from: 'noreplykloudstorage@gmail.com',
           templateId: Config.sendGrid.template.verification,
     
           dynamic_template_data: {
                verification_URL
            }
         };

         Logger.silly(`Sending mail to : ${email}`);
         const sent = await send(data);
         
         if(!sent){
             throw Error('Internal Server Error');
         }

         return null;

    } catch (e) {
        Logger.debug('src/services/mailer/sendVerifyMail');
        return e;
    }
}


/**************  MODULE EXPORTS ***********/

export default {
   sendVerifyMail
}