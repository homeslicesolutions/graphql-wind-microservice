# graphql-wind-microservice
Experimental project to use GraphQL with Node/Express with our Rome API

To test it, ```yarn``` then do ```yarn start```

The configuration like port name and namespace, look at ```configuration.json```

After running, try to hit this API: ```http://localhost:3001/graphql```

## GraphQL Progress
JOE: So I have been working on breaking down microservices trying to query something like this:

```gql
query CarsInEachRegion {
  regions {
    label
    state
    cars {
      id
      make
      model
      modelYear
    }
  }
}

query CarsInOneRegionByLabel {
  region(label: "San Francisco Bay Area") {
    label
    state
    cars {
      id
      make
      model
      modelYear
    }
  }
}

query CarsWithRegion {
  cars {
    id
    make
    model
    modelYear
    region {
      label
      state
    }
  }
}

query OneCarWithRegion {
  car(id: "bda7a2d5-fdb0-451f-816b-703a3b95e056") {
    make
    model
    modelYear
    region {
      label
      state
    }
  }
}
```

Just to get All the regions and then fetch all the cars per region.  (Like an interview question huh?). So you can try to do this and see what you get back.  Then you can play around with it more.

TODO: 
- Using DataLoader to batch calls so there wouldn't be multiple region calls per car

## Key things:
- It's all about the structure of the files and where they are location and how it's built
- It's supposed to be scalable and easy to stick in Middleware as needed.  Also easier to add new routes to do other things outside of API.  The main thing is the API structure

