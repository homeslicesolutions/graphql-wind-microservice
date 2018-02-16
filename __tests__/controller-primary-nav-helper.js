const {
  createNavItem,
  populateBaseUrl,
  findModule,
  appendQueryParam
} = require('../api/primary-nav/helpers');

describe('Primary Nav helper functions', () => {

  it('populateBaseUrl(url, items) => should recursively populate a base url to a list of items', (done) => {

    // ARRANGE
    const items = [
      {
        url: '/one'
      },
      {
        url  : '/two',
        items: [
          {
            url: '/two/three'
          }
        ]
      }
    ];

    // ACT
    const result = populateBaseUrl('http://something', items);

    // ASSERT
    expect(result).toMatchObject([
      {
        "url": "http://something/one"
      },
      {
        "url"  : "http://something/two",
        "items": [
          {
            "url": "http://something/two/three"
          }
        ]
      }
    ]);

    //console.log(JSON.stringify(result, null, 2));
    /* expect(result).toMatchObject([
       {
         "url": "http://something.com?dude=yes"
       },
       {
         "url"  : "http://something.com?another=param&dude=yes",
         "items": [
           {
             "url": "http://somethingelse.com?dude=yes"
           }
         ]
       }
     ]);*/

    done();
  });

  it('findModule(url, items) => should recursively find the module from a list of items', (done) => {

    // ARRANGE
    const items = [
      {
        url   : '/one',
        module: 'one'
      },
      {
        url   : '/two',
        module: 'two',
        items : [
          {
            url   : '/two/three',
            module: 'three'
          }
        ]
      },
      {
        url   : '/four',
        module: 'four',
        items : [
          {
            url   : '/four/five',
            module: 'five'
          }
        ]
      }
    ];

    // ACT
    const result = findModule(items, 'three');

    // ASSERT
    expect(result).toEqual({
      url   : '/two/three',
      module: 'three'
    });

    done();
  });

  it('createNavItem(label, description, url, discreet, hidden, module, items) => should return a primary nav. object', (done) => {

    // ACT
    const result = createNavItem('a label', 'some description', 'http://google.com', false, false, 'google', [{url: 'http://yahoo.com'}]);

    // ASSERT
    expect(result).toEqual({
      label      : "a label",
      description: "some description",
      url        : "http://google.com",
      discreet   : false,
      hidden     : false,
      module     : "google",
      items      : [{url: "http://yahoo.com"}]
    });

    done();
  });

  it('appendQueryParam(items, params) => should recursively append a query param. to a list of items', (done) => {

    // ARRANGE
    const items = [
      {
        url: 'http://something.com'
      },
      {
        url  : 'http://something.com?another=param',
        items: [
          {
            url: 'http://somethingelse.com'
          }
        ]
      }
    ];

    // ACT
    const result = appendQueryParam(items, 'dude=yes');

    // ASSERT
    expect(result).toMatchObject([
      {
        "url": "http://something.com?dude=yes"
      },
      {
        "url"  : "http://something.com?another=param&dude=yes",
        "items": [
          {
            "url": "http://somethingelse.com?dude=yes"
          }
        ]
      }
    ]);

    done();
  });

});