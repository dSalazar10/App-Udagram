![logo](logo.png)
-------------------
![pass](https://img.shields.io/badge/build-passing-brightgreen.svg)
![GitHub](https://img.shields.io/github/license/dsalazar10/App-Udagram.svg)
![Language](https://img.shields.io/badge/Language-Typescript-blue.svg)
![size](https://img.shields.io/github/repo-size/dsalazar10/App-Udagram.svg)

This repo contains answers to the assignment. If you are currently taking the course, spoilers beware!

![](Main.png)


## Endpoints


### Rest API

Base URL for Rest API is http://udagram.me/api/v0

/feed
  - `GET /` get all images
  - `GET /:id` get a specific image
  - `GET /signed-url/:fileName` (requires auth) get signedURL
  - `GET /` (requires auth) upload an image
  - `PATCH /:id` (requires auth) update a specific image

/user
  - `GET /` reserved
  - `GET /:id` get a specific user
  
 /user/auth
  - `GET /` reserved
  - `GET /verification` (requires auth) verify credentials are valid
  - `POST /` register a new user
  - `POST /login` login

 ### Image Filter
 
 Base URL for Image Filter API is http://filter.udagram.me/api/v0
 
 /filter
   - `GET /` reserved
   - `POST /grey` (requires auth)
   * ![](./Image_Filter_Server/tutorial/grey.jpeg)
   - `POST /sepia` (requires auth)
   * ![](./Image_Filter_Server/tutorial/sepia.jpeg)
   - `POST /blur` (requires auth)
   * ![](./Image_Filter_Server/tutorial/blur.jpeg)
   - `POST /gaussian` (requires auth)
   * ![](./Image_Filter_Server/tutorial/gaussian.jpeg)
   - `POST /mirror` (requires auth)
   * ![](./Image_Filter_Server/tutorial/mirror.jpeg)
   - `POST /invert` (requires auth)
   * ![](./Image_Filter_Server/tutorial/invert.jpeg)
 
  /user
  - `GET /` reserved
  - `GET /:id` get a specific user
  
 /user/auth
  - `GET /` reserved
  - `GET /verification` (requires auth) verify credentials are valid
  - `POST /` register a new user
  - `POST /login` login
