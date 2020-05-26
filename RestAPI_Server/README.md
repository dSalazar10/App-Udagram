# RestAPI Server

![Backend](./tutorial/RestAPI.png)

The RestAPI Server is a nodejs/typescript cloud server which
* Manages user authentication, storing emails and password hashes in an AWS Relational Database Service (DB)
* Manages user data, storing images in an AWS Simple Storage Service (FS)
* Manages image filters using the Image_Filter_Server (top server)
![](Server_Overview.png)


---------------------------------------------
### **TABLE OF CONTENT**
* [Prerequisites](#prereqs)
* [Setting up the database](#setting-up-database)
* [Setting up Postbird](#setting-up-postbird)
* [Setting up the Filestore](#setting-up-filestore)
* [Setting up an AWS User Account](#setting-up-account)
* [Local Deployment](#setting-up-local)
* [Running the local tests](#local-testing)
* [Cloud Deployment](#cloud-deploy)
* [Running the Cloud Tests](#cloud-testing)

---------------------------------------------


<a name="prereqs"></a>
### Prerequisites

See the [wiki](https://github.com/dSalazar10/App-Udagram/wiki/Getting-Setup) for instructions on installing the following:
* Nodejs and NPM
* Postman
* Postbird
* Visual Studio Code
* Amazon Web Services Account
* AWS CLI

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and 
testing purposes. See deployment for notes on how to deploy the project on a live system.

<a name="setting-up-database"></a>
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
  
<a name="setting-up-postbird"></a>
### Setting up Postbird

* Open Postbird
![](./tutorial/L5-1.png)
* Copy and paste the endpoint, username, password, and database name
![](./tutorial/L5-2.png)
* Click the “Save & Connect” button
![](./tutorial/L5-3.png)
* Now your Database setup is complete. Great job!

<a name="setting-up-filestore"></a>
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

<a name="setting-up-account"></a>
### Setting up an AWS User Account

* Navigate to the AWS home page and search services for IAM
![](./tutorial/L7-1.png)
* Click the ‘Users’ button in the navigation bar on the left
* Click the ‘Add user’ button
* Type in a new user name
* Click the ‘Programmatic access’ radio button
![](./tutorial/L7-5.png)
* Click next
* Click the ‘Create group’ button
![](./tutorial/L7-7.png)
* Click the ‘Create policy’ button
![](./tutorial/L7-8.png)
  - Click the ‘Choose a Service’ button 
  ![](./tutorial/L7-8a.png)
  - Type in “S3” and click the S3 button
  - Click the ‘All S3 actions (s3:*)’ radio button
  ![](./tutorial/L7-8c.png)
  - Click the ‘Response’ tab
  - Click the ‘bucket’ tab’s ‘Add ARN’ button
  ![](./tutorial/L7-8e.png)
  - Enter your S3 bucket name in the text box and click ‘Add’
  ![](./tutorial/L7-8f.png)
  - Click the ‘object’ tab’s ‘Add ARN’ button
  - Enter your S3 bucket name for the ‘bucket name’ field
  - Click the ‘Any’ radio button for the ‘object name’ field
  ![](./tutorial/L7-8i.png)
  - Click ‘Add’ 
  - Click ‘Review Policy’
  - Add a name for your policy
  ![](./tutorial/L7-8l.png)
  - Click ‘Create Policy’
* Now go back to the tab you started in and enter the policy name you just created
![](./tutorial/L7-9.png)
* Enter a name for your group
* Click the refresh button and search for the policy you just created
* Click the radio button next to your policy and click ‘Create Group’
* Click ‘Next’
* Click ‘Next’
* Click ‘Create User’
* Click the ‘Download .csv’ button to download your credentials
![](./tutorial/L7-16.png)
* Click ‘Close’
* For instructions on how to configure the Amazon Web Services Command Line Interface (aws-cli) go 
[here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

<a name="setting-up-local"></a>
### Local Deployment

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

<a name="local-testing"></a>
### Running the local tests

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


## AWS Cloud Development

<a name="cloud-deploy"></a>
<a name="cloud-testing"></a>
### Cloud Deployment & Testing

Refer to my Cloud DevOps Engineer Repo [here](https://github.com/dSalazar10/Project-Dev_Ops_Engineering)

------------------------
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

## Authors
This repo was forked from Udacity's GitHub page as per the assignment
[udacity/cloud-developer](https://github.com/udacity/cloud-developer/tree/master/course-02)
* Udacity Cloud Developer authors: **[Udacity](https://github.com/eddyudacity)** and **[Michele Cavaioni](https://github.com/Udacavs)** for their *initial work*
* Udacity Cloud Developer student: **dSalazar10** for my participation in the exercises

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/dSalazar10/App-Udagram/blob/master/LICENSE) file for details

## Acknowledgments

* Hat tip to [Gabe Ruttner](https://github.com/grutt) for teaching the Full Stack Apps on AWS course.
