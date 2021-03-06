'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const jsonEndpoint = require('./jsonEndpoint');

describe('jsonEndpoint', () => {
  
  it('should return 400 status and error message when responseData is not included', (done) => {
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };
    
    Promise.resolve(jsonEndpoint({}, res))
      .then(() => {
        expect(res.status.calledWith(400), 'did not send 400 when missing responseData').to.equal(true);
        expect(res.json.calledWith({
          errors: [{
            error: 'sorry we couldn\'t interpret you\'re request',
            status: 400
          }]
        }), 'did not send error message when missing responseData')
          .to.equal(true);
        
        done();
      })
      .catch(err => done(err));
  });
  
  it('should send the responseData status and responseData data when included', (done) => {
    
    const req = {
      responseData: {
        status: 420,
        data: [{
          state: 'of mind',
          needs: 'tacos'
        }]
      }
    };
    
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };
    
    Promise.resolve(jsonEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(420), 'did not set status when responseData.status was included').to.equal(true);
        expect(res.json.calledWith(req.responseData), 'did not send data when responseData.data was included ').to
          .equal(true);
        
        done();
      })
      .catch(err => done(err));
  });
  
  it('should send the error message and status status when errors are included', (done) => {
    
    const req = {
      responseData: {
        status: 444,
        errors: [{
          state: 'of mind',
          needs: 'tacos'
        }]
      }
    };
    
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };
    
    Promise.resolve(jsonEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(444), 'did not set status when responseData.status was included').to.equal(true);
        expect(res.json.calledWith(req.responseData), 'did not send data when responseData.data was included ').to
          .equal(true);
        
        done();
      })
      .catch(err => done(err));
  });
});
