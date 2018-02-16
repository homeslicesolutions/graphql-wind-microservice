'use strict';

const assert = require('assert');
const mocks  = require('node-mocks-http');
const rewire = require('rewire');
const nock   = require('nock');

const controller = require('../api/hubs/controller.js');
const services = require('../api/hubs/services.js');
const helpers = require('../api/hubs/helpers.js');

const getHubs          = services.getHubs;
const getHub           = services.getHub;
const querySearch      = helpers.querySearch;
const querySortBy      = helpers.querySortBy;
const querySelectedIds = helpers.querySelectedIds;

describe('API: Hubs Controller', () => {
  const mockHost   = 'http://localhost:9819';
  let req, result;

  afterEach(() => {
    nock.cleanAll();
  });

  it('getHubs => query string should be oData compliant: form correct query parameters without unescaping special characters (i.e. $top, $skip, etc.)', done => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/smartHub/hubs')
      .query(function (queryObj) {
        result = Object.keys(queryObj);
        return true;
      })
      .reply(200, [
        {id: 1, name: 'Hub test', counters: {sourcesCount: 123}},
        {id: 3, name: 'Another Hub', counters: {sourcesCount: 984}},
        {id: 7, name: 'говорить ', counters: {sourcesCount: 3}},
        {id: 20, name: '中英字典', counters: {sourcesCount: 7}}
      ]);

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      smartHub : `${mockHost}/smartHub/`,
      reporting: `${mockHost}/reporting/`
    };

    // ACT => Run service method
    getHubs(req, {
      $orderby: 'Name asc',
      $top    : '15',
      $skip   : '0',
      $filter : '(substringof(tolower("Name%3D"),tolower("test")))'
    }).then(() => {

      // ASSERT => Compare result
      assert(result.includes('$orderby'));
      assert(result.includes('$top'));
      assert(result.includes('$skip'));
      assert(result.includes('$filter'));

      done();
    });
  });

  it('getHub => should call hub provided hubId', (done) => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/smartHub/hubs/1')
      .query(function (queryObj) {
        result = Object.keys(queryObj);
        return true;
      })
      .reply(200, {id: 1, name: 'Hub test', counters: {sourcesCount: 123}});

    // ACT => Run service method
    getHub(req, 1).then(result => {

      // ASSERT => Compare result
      assert.deepEqual(result, {id: 1, name: 'Hub test', counters: {sourcesCount: 123}});

      done();
    })
  });

  it('querySearch(String) =>  should be able to map query "search" to oData filter expression searching only by Name', done => {
    // ACT => Execute
    result = querySearch({search: "test"});

    // ASSERT => Compare results
    assert.deepEqual(result, { search: 'test' });
    done();
  });

  it('querySearch(String) =>  should be able to map query "search" to oData filter expression searching only by Name', done => {
    // ACT => Execute
    result = querySearch({search: "test"});

    // ASSERT => Compare results
    assert.deepEqual(result, { search: 'test' });
    done();
  });

  it('querySearch(Integer) =>  should be able to map query "search" to oData filter expression searching by ID or Name', done => {
    // ACT => Execute
    result = querySearch({search: "123"});

    // ASSERT => Compare results
    assert.deepEqual(result, {search: "123"});
    done();
  });

  it('querySearch(Name:[String]) => should be able to filter just the "Name"', done => {
    // ACT => Execute
    result = querySearch({search: "Name:test"});

    // ASSERT => Compare results
    assert.deepEqual(result, { '$filter': 'substringof(tolower(\'test\'),tolower(Name))' });
    done();
  });

  it('querySearch(Id:[String]) => should be able to filter just the Hub Id"', done => {
    // ACT => Execute
    result = querySearch({search: "Id:123"});
    const result2 = querySearch({search: "hubId:456"});

    // ASSERT => Compare results
    assert.deepEqual(result, { '$filter': '(Id eq \'123\')' });
    assert.deepEqual(result2, { '$filter': '(Id eq \'456\')' });
    done();
  });

  it('querySearch(Id:[Comma Sep]) => should be able to filter many the Hub Ids"', done => {
    // ACT => Execute
    result = querySearch({search: "Id:123,324,432"});

    // ASSERT => Compare results
    assert.deepEqual(result, { '$filter': '(Id eq \'123\') or (Id eq \'324\') or (Id eq \'432\')' });
    done();
  });

  it('querySortBy => should be able to sort using query "sortBy" and "sortDirection"', done => {
    // ACT => Execute
    result = querySortBy({sortBy: "name", sortDirection: "desc"});

    // ASSERT => Compare results
    assert.deepEqual(result, {'$orderby': 'Name+desc'});
    done();
  });

  it('querySortBy => should be able to sort using query "sortBy" without "sortDirection" (default to ascending)', done => {
    // ACT => Execute
    result = querySortBy({sortBy: "name"});

    // ASSERT => Compare results
    assert.deepEqual(result, {'$orderby': 'Name+asc'});
    done();
  });

  it('querySelectedIds => should be able to map query "ids" with comma separated to oData filter expression', done => {
    // ACT => Execute
    result = querySelectedIds({ids: '1,6,3,2,99'});

    // ASSERT => Compare results
    assert.deepEqual(result, {'$filter': '(Id eq \'1\' or Id eq \'6\' or Id eq \'3\' or Id eq \'2\' or Id eq \'99\')'});
    done();
  });

  it('querySelectedIds => should be able to combine map query "ids" & "search" to oData filter expression', done => {
    // ACT => Execute
    result = querySelectedIds(querySearch({ids: '1,6,3,2,99', search: 'test'}));

    // ASSERT => Compare results
    assert.deepEqual(result, {
      search: 'test',
      $filter: '(Id eq \'1\' or Id eq \'6\' or Id eq \'3\' or Id eq \'2\' or Id eq \'99\')'
    });

    done();
  });

  // TODO: Handling errors
});