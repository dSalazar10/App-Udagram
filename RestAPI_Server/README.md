# RestAPI Server

The RestAPI Server (bottom server) is a nodejs/typescript cloud server which
* Manages user authentication, storing emails and password hashes in an AWS Relational Database Service (DB)
* Manages user data, storing images in an AWS Simple Storage Service (FS)
* Manages image filters using the Image_Filter_Server (top server)
![](Server_Overview.png)

### Prerequisites


* Nodejs and NPM
* Postman
* Postbird
* Visual Studio Code
* Amazon Web Services Account
* AWS CLI

### Installing

The server is dependent on Nodejs and Node Package Manager. 
* Installation instructions can be found [here](https://nodejs.org/en/download/)
* To test if Nodejs is installed, execute the following code in your terminal: `npm -v`

We can issue and save requests to the server with ease using Postman. 
* Installation instruction can be found [here](https://www.getpostman.com/downloads/).

We can interact with our database with ease using Postbird.
* Installation instructions can be found [here](https://github.com/paxa/postbird).

We can interact with our repo with ease using Visual Studio Code.
* Installation instructions can be found [here](https://code.visualstudio.com/docs/setup/setup-overview).

We will be using multiple services provided by Amazon Web Services, so you will need to set up an account.
* Instructions can be found [here](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

We will be interacting with our AWS services using the command line, so you will need the AWS CLI
* Instructions can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and 
testing purposes. See deployment for notes on how to deploy the project on a live system.

### Setting up the database

* Go to the main page of AWS [here](https://aws.amazon.com).
* Sign into your console
* Click the Services button.
* Search for RDS and click RDS
![](./tutorial/L4-1.png)
* Click ‘Create Database’
![](./tutorial/L4-2.png)
  - Select PostGres SQL
  - Check the radio button “Only enable options eligible for RDS Free Usage Tier”
  - Click next
  ![](./tutorial/L4-3a.png)
* Database Details:
  - Keep the Instance Specifications at their default settings. Be sure that your DB instance class is ‘db.t2.micro’
  ![](./tutorial/L4-4a.png)
  - Settings - Enter a DB Instance Identifier, a Master username, and Master password
    ![](./tutorial/L4-4b.png)
  - Network & Security - set Public accessibility to yes and keep the rest of the settings default
    ![](./tutorial/L4-4c.png)
  - Database options - enter a database name and keep the rest default
    ![](./tutorial/L4-4d.png)
  - Backup – keep everything default
  - Monitoring – keep everything default
  ![](./tutorial/L4-4e.png)
  - Performance Insights - keep everything default
  - Log exports – select Postgresql log
  - Maintenance - keep everything default
  - Delete Protection – be sure the radio button is checked and click Create Database
  ![](./tutorial/L4-4h.png)
  - Navigate to the database to obtain the endpoint url
  ![](./tutorial/L4-4i.png)
  
### Setting up Postbird
* Open Postbird
![](./tutorial/L5-1.png)
* Copy and paste the endpoint, username, password, and database name
![](./tutorial/L5-2.png)
* Click the “Save & Connect” button
![](./tutorial/L5-3.png)
* Now your Database setup is complete. Great job!


### Setting up the Filestore

* On the main page of AWS, click Services and search for S3
* Click S3
![](./tutorial/L6-1.png)
* Click ‘Create Bucket’
  - Enter in a domain wide unique bucket name and your region, and click next
  ![](./tutorial/L6-3a.png)
  - Click the radio box to turn on “Automatically encrypt objects when they are stored in S3” and set it to AES-256, and click 
  next
  ![](./tutorial/L6-3c.png)
  - Make sure that the radio box is selected for “Block all public access”.
  ![](./tutorial/L6-3e.png)
  - We will be using a signedURL pattern to provide access indirectly
  ![](./tutorial/L6-3f.png)
  - Click next, review, and then click create
* Open the bucket by clicking on its name
![](./tutorial/L6-4.png)
* Click the permissions tab at the top
![](./tutorial/L6-5.png)
  - Click CORS configuration
  ![](./tutorial/L6-5a.png)
  - A configuration file is located in the RestAPI Server folder 
  [here]( https://github.com/dSalazar10/App-Udagram/blob/dev/RestAPI_Server/RestAPI.CORS_policy.xml). 
  - Copy and paste the XML code into the development environment
  ![](./tutorial/L6-5c.png)
  - Click Save



### Setting up the local server

* Clone the repo
![](./tutorial/L2-2.png)
* Open the RestAPI_Server folder in Visual Studio Code
![](./tutorial/L2-3.png)
* Open a new terminal in Visual Studio Code
* To install the project’s dependencies, type in `npm i` and press enter
![](./tutorial/L2-5.png)
* To start the server, type in `npm run dev`
![](./tutorial/L2-6.png)
* The server can be located at `http://localhost:8080`

## Running the local tests

* Open Postman and close the startup menu
* Type in ` http://localhost:8080/` and hit send
![](./tutorial/L3-2.png)
  * Here we see the root response telling us that the api is located at /api/v0/
* You can import the provided test collections
  * Click the ‘Import’ button in the upper left
  ![](./tutorial/L3-3a.png)
  * Click the ‘Choose Files’ button
  ![](./tutorial/L3-3b.png)
  * Navigate to the RestAPI Server folder `App-Udagram-master > RestAPI_Server`
  * Open ‘RestAPI.postman_collection.json’ file
  ![](./tutorial/L3-3d.png)
  * Click the ‘Collections’ button, below the ‘Import’ button
  ![](./tutorial/L3-3e.png)
  * Here you will find three folders to test different features

Public:
- test getting all the images in the feed
- test getting a specific image
- test creating a new user with valid credentials
- test creating a new user with invalid credentials
- test loggin in with valid credentials
- test loggin in with invalid credentials

Unauthorized:
- test posting an image with invalid credentials

Authorized: 
- test posting an image with valid credentials and a malformed payload
- test posting an image with valid credentials and valid payload

## Cloud Deployment

@TODO: Complete Cloud Deployment Tutorial

## Running the Cloud Tests

@TODO Complete Cloud Testing Tutorial

## Built With

* [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript) a promise-based Node.js + typescrpt 
Object-Relational Mapping for PostgresSQL.
* [AWS CLI](https://aws.amazon.com/cli/) helps us manage our S3 and Elastic Beanstalk
services.
* [express](https://expressjs.com) framework helps us build our webserver. 
* [bcrypt](https://www.npmjs.com/package/bcrypt) library helps us hash passwords.
* [JsonWebToken](https://github.com/auth0/node-jsonwebtoken) library helps us manage tokens.
* [connect](https://www.npmjs.com/package/connect) library helps us glue together middleware.
* [email-validator](https://www.npmjs.com/package/email-validator) library helps us validate emails.
* [body-parser](https://github.com/expressjs/body-parser) helps us parse, remove, and make use of inbound requests.
* [sentry](https://sentry.io/signup/) library helps us with analytics and crash reports.

## Authors
This repo was forked from Udacity's GitHub page as per the assignment
[udacity/cloud-developer](https://github.com/udacity/cloud-developer/tree/master/course-02)
* Udacity Cloud Developer authors: **[Udacity](https://github.com/eddyudacity)** and **[Michele Cavaioni](https://github.com/Udacavs)** for their *initial work*
* Udacity Cloud Developer student: **dSalazar10** for my participation in the exercises

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/dSalazar10/App-Udagram/blob/master/LICENSE) file for details

## Acknowledgments

* Hat tip to [Gabe Ruttner](https://github.com/grutt) for teaching the Full Stack Apps on AWS course.
