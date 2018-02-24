# node-express-rest-api-boilerplate
One of many boilerplates that uses NodeJS and Express

To test it, ```npm i``` then do ```npm start```

The configuration like port name and namespace, look at ```configuration.json```

After running, try to hit this API: ```http://localhost:8001/api/countries```


## Key things:
- It's all about the structure of the files and where they are location and how it's built
- It's supposed to be scalable and easy to stick in Middleware as needed.  Also easier to add new routes to do other things outside of API.  The main thing is the API structure
- In the API structure, the key is the utilization of using Generators and Co-routine to write a clean Promise sync code


