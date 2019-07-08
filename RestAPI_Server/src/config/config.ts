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
export const config = {
  'dev': {
    'username': process.env.POSTGRESS_USERNAME,
    'password': process.env.POSTGRESS_PASSWORD,
    'database': process.env.POSTGRESS_DATABASE,
    'host': process.env.POSTGRESS_HOST,
    'dialect': 'postgres',
    'aws_reigion': 'us-east-2',
    'aws_profile': process.env.AWS_PROFILE,
    'aws_media_bucket': process.env.AWS_MEDIA_BUCKET,
    'jwt_secret': process.env.JWT_SECRET,
    'filter_host': process.env.FILTER_HOST
  },
  'prod': {
    'username': process.env.POSTGRESS_USERNAME,
    'password': process.env.POSTGRESS_PASSWORD,
    'database': process.env.POSTGRESS_DATABASE,
    'host': process.env.POSTGRESS_HOST,
    'dialect': 'postgres',
    'aws_reigion': 'us-east-2',
    'aws_profile': process.env.AWS_PROFILE,
    'aws_media_bucket': process.env.AWS_MEDIA_BUCKET,
    'jwt_secret': process.env.JWT_SECRET,
    'filter_host': process.env.FILTER_HOST
  }
};
