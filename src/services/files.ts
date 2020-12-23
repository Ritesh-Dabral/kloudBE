/**
 * File upload class used to provide several method, 
 * and used in respective files route and nowhere else
 * 
 */

 

 import Config from '../config/index';
 import { IFiles } from '../interfaces/IFiles';
 import { IUser } from '../interfaces/IUser';
 import Logger from '../loaders/logger';
 import AllModels from '../models/index';
 import {Model,Document} from 'mongoose';
 import fs from 'fs';
 import { Response } from 'express';
 
 
 const AWS  = require('aws-sdk');

 export default class FilesHandling {

    private  s3_client = new AWS.S3({
        accessKeyId: Config.aws.accessKeyId,
        secretAccessKey: Config.aws.secretAccessKey,
        region: Config.aws.region
    });

    private FileModel: Model<IFiles & Document> = AllModels.FileModel;

    private UserModel: Model<IUser & Document> = AllModels.UserModel;

    constructor(){
    }

    /**
     * This method is responsible to 
     * add files to the AWS S3
     * 
     * @param files : contains uploaded files (buffer)
     * @param uid : user id (acts as folder)
     * 
     * returns an array or uploaded files object
     * with fields: fileKey, url, original name and mime type
     */
    public async addFiles(files,uid,storage:number){

        try {
                Logger.silly('✅ Adding Files to S3 ');

                Logger.silly('Verifying files');
                let isNotValidName=false,isNotValidSize=false;

                for(let i=0;i<files['myFiles'].length;i++){
                    if(!files['myFiles'][i].originalname.match(/\.{1}[\w]+$/)){
                        isNotValidName = true;
                    }
                    if( (files['myFiles'][i].size/Math.pow(10,6)) < 0.0000000001){
                        isNotValidSize = true;
                    }   
                }

                if(isNotValidSize || isNotValidName){
                    throw Error('Invalid name or size of one or more files');
                }

                let uploadedFileData = [];
            
                for(let i=0;i<files['myFiles'].length;i++){

                    // fix original name by removing space and slash
                    let chunksOfOriginalName = files['myFiles'][i].originalname.replace(/\s/,'');
                    let newOriginalName='';
                    for(let i=0;i<chunksOfOriginalName.length;i++){
                        if(chunksOfOriginalName[i]!=='/' && chunksOfOriginalName[i]!=='\\'){
                            newOriginalName+=chunksOfOriginalName[i];
                        }
                    }

                    //loop through chunks and stick them together
                    newOriginalName = `${uid}/${Date.now()}_${newOriginalName}`;


                    let fileParams = {
                        Bucket: Config.aws.bucketName,
                        Key: `${newOriginalName}`,
                        Body: files['myFiles'][i].buffer,
                        ContentType: files['myFiles'][i].mimetype,
                        ACL:'private'
                    }
        
                    const data = await this.s3_client.upload(fileParams).promise();
                    
                    if(!data){
                        throw Error('Addition Error');
                    }

                    uploadedFileData.push(
                        {
                            uid:uid,
                            fileKey:`${newOriginalName}`,
                            url:data.Location, 
                            originalname:files['myFiles'][i].originalname,
                            contentType: files['myFiles'][i].mimetype,
                            ACL:'private',
                            size:files['myFiles'][i].size/Math.pow(10,6)
                        }
                    );
                }

                Logger.silly(' Adding uploaded meta to Files DB');
                const FileDBResponse = await this.FileModel.insertMany(uploadedFileData);
                
                if(!FileDBResponse){
                    throw Error('Addition Error');
                }

                Logger.silly('Changing user\'s storage value');
                let sizeInMb:number = 0;
                files['myFiles'].forEach(file => {
                    sizeInMb = sizeInMb + (file.size/Math.pow(10,6));
                });
                storage -= sizeInMb;

                storage = (storage<0)?(0):(storage);
                const UserDBResponse = await this.UserModel.findByIdAndUpdate(uid, {"storage":storage});

                if(!UserDBResponse){
                    throw Error('Addition Error');
                }

            return uploadedFileData;
        } catch (e) {
            Logger.debug('/src/services/files/addFiles');
            throw(e);
        }
    }


    /**
     * 
     * @param fileKey : Key of the file to be deleted
     * @param id :User Id which acts as a folder
     */
    public async deleteFiles(fileKey:string,uid,storage:number){
        try {
            Logger.silly(`✅ Deleting file ${fileKey} from S3 `);

            const delParams = {
                Bucket: Config.aws.bucketName,
                Key:fileKey
            };

            const data = await this.s3_client.deleteObject(delParams).promise();

            if(!data){
                throw Error('Deletion Error');
            }

            
            Logger.silly('Getting file\'s size based on fileKey');
            let FileDBResponse = await this.FileModel.findOne({"fileKey":fileKey});

            if(!FileDBResponse){
                throw Error('Deletion Error');
            }

            storage += FileDBResponse.size;

            storage = (storage>20)?(20):(storage);
            Logger.silly('Changing user\'s storage value');
            const UserDBResponse = await this.UserModel.findByIdAndUpdate(uid, {"storage":storage});

            if(!UserDBResponse){
                throw Error('Addition Error');
            }

            Logger.silly('Deleting object file');
            FileDBResponse = await this.FileModel.findByIdAndDelete(FileDBResponse._id);
            if(!FileDBResponse){
                throw Error('Deletion Error');
            }

            return null;
        } catch (e) {
            Logger.debug('/src/services/files/addFiles');
            throw(e);
        }
    }


    /**
     * This function is used to toggle the public link
     * of file present in s3
     * 
     * @param fileKey : File key present in s3
     * @param sharable : true/false toggle
     */
    public async toggleShareable(fileKey:string, sharable:Boolean){
        try {
            Logger.silly(`✅ Toggling sharable mode`);

            const shareParams = {
                Bucket:Config.aws.bucketName, 
                Key:fileKey,
                ACL:sharable?('public-read'):('private')
            }


            const data = await this.s3_client.putObjectAcl(shareParams).promise();

            if(!data){
                throw Error('Shareable Error');
            }

            Logger.silly('Toggling ACL');
            const FileDBResponse = await this.FileModel.findOneAndUpdate({"fileKey":fileKey},{"ACL":sharable?('public-read'):('private')});

            if(!FileDBResponse){
                throw Error('Shareable Error');
            }

            if(sharable){
                Logger.silly('Generating sharable URL');
                const url = Config.aws.bucketLink+fileKey;
                return url;
            }

            return null;

        } catch (e) {
            Logger.debug('/src/services/files/sharableAddRemove');
            throw(e);           
        }
    }


    /**
     * Download request from node
     * 
     * @param fileId : file's unique mongo ID
     * @param fileKey : file's unique key
     * @param res : respose (express)
     */
    public async download(fileId:string,fileKey:string){
        try {
            Logger.silly(`✅ Download file service`);

            var downloadParams = {
                Bucket: Config.aws.bucketName,
                Key: `${fileId}/${fileKey}`
            };

            Logger.silly('Getting Object');

            const fileData = this.s3_client.getObject(downloadParams).promise();

            return fileData;

        } catch (e) {
            Logger.debug('/src/services/files/download');
            throw(e);  
        }
    }


    /**
     * List of all files along with their access control
     * 
     * @param userId : user id to fetch related files
     */
    public async viewFiles(userId){
        try {
            Logger.silly(`✅ Fetching User Files`);
            
            const files = await this.FileModel.find({"uid":userId});

            if(!files){
                throw Error('Error Fetching Files');
            }
            
            return files;
        } catch (e) {
            Logger.debug('/src/services/files/viewFiles');
            throw(e);              
        }
    }
 }