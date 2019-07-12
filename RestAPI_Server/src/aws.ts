/* MIT License

Copyright (c) 2019 Daniel Salazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import AWS = require('aws-sdk');
import {config} from './config/config';

const c = config.dev;
// Configure AWS credentials
if (c.aws_profile !== 'DEPLOYED') {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});;
}
// Configure S3 credentials
export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_reigion,
  params: {Bucket: c.aws_media_bucket}
});
/* getGetSignedUrl generates an aws signed url to retrieve an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl( key: string ): string {

  const signedUrlExpireSeconds = 60 * 5;

    return s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ) {
    return s3.getSignedUrl('putObject', {
      Bucket: c.aws_media_bucket,
      Key: key,
      Expires: 60 * 5
    });
}

/*
* To ensure that data is not corrupted traversing the network,
* use the Content-MD5 header. When you use this header,
* Amazon S3 checks the object against the provided MD5 value
* and, if they do not match, returns an error. Additionally,
* you can calculate the MD5 while putting an object to Amazon
* S3 and compare the returned ETag to the calculated MD5 value.
* */
// Upload the filtered image into the S3 bucket
export function uploadImage(key: string, image: Buffer) {
    return Promise.resolve( new Promise((res, rej) => {
        s3.putObject({
            Body: image,
            Bucket: c.aws_media_bucket,
            Key: key,
            ACL: 'private',
            ContentType: 'binary',
            ServerSideEncryption: 'AES256'
        }, function (err, data) {
            if (err) {
                return rej(err);
            }
            const eTag = data.ETag;
            return res({ eTag });
        });
    }));
}

// Get an image from the S3 bucket
export function getImage(key: string) {
    return Promise.resolve( new Promise((res, rej) => {
        s3.getObject({
            Bucket: c.aws_media_bucket,
            Key: key,
        }, function(err, data) {
            if (err) {
                return rej(err);
            }
            const contentType = data.ContentType;
            const image = data.Body;
            return res({ image, contentType });
        });
    }));
}

