![logo](logo.png)
-------------------
![pass](https://img.shields.io/badge/build-passing-brightgreen.svg)
![GitHub](https://img.shields.io/github/license/dsalazar10/App-Udagram.svg)
![Language](https://img.shields.io/badge/Language-Typescript-blue.svg)
![size](https://img.shields.io/github/repo-size/dsalazar10/App-Udagram.svg)

This repo contains answers to the assignment. If you are currently taking the course, spoilers beware!

![](Main.png)

Base URL for API is /api/v0

## Endpoints

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

 
  
