'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('getSingleFile', function () {
  
  it('should return an image file if one is found', function (done) {
    const fsStub = {
      readdir: function (path, callback) {
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    // eslint-disable-next-line prefer-const
    let getSingleFile = proxyquire('./getSingleFile', {'fs': fsStub});
    const req = {
      params: {
        fileName: 'test-image.jpg'
      }
    };
    
    getSingleFile(req, {}, (err) => {
      if (err) done(err);
      expect(err).to.not.exist;
      expect(req.fileName).to.equal('test-image.jpg');
      
      done();
    });
  });
  
  it('should not set req.fileName when no image is found', function (done) {
    const fsStub = {
      readdir: function (path, callback) {
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    // eslint-disable-next-line prefer-const
    let getSingleFile = proxyquire('./getSingleFile', {'fs': fsStub});
    const req = {
      params: {
        fileName: 'test-image-not-in-directory.jpg'
      }
    };
    const res = {};
    
    getSingleFile(req, res, (err) => {
      if (err) done(err);
      expect(err).to.not.exist;
      expect(req.fileName).to.be.undefined;
      
      done();
    });
  });
  
  it('should not set req.fileName when no params are included', function (done) {
    const fsStub = {
      readdir: function (path, callback) {
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    // eslint-disable-next-line prefer-const
    let getSingleFile = proxyquire('./getSingleFile', {'fs': fsStub});
    const req = {
      params: {
        // fileName: 'test-image.jpg'
      }
    };
    const res = {};
    
    getSingleFile(req, res, (err) => {
      if (err) done(err);
      expect(req.fileName).to.be.undefined;
      
      done();
    });
  });
  
  it('should call the next with error when an error is returned', function (done) {
    const req = {
      params: {
        fileName: 'tuna.js'
      },
      body: {
        base64String: 'ba',
        fileName: 'testName.png'
      }
    };
    const pathStub = {
      join: () => {
        return '/fake/path';
      }
    };
    const nextSpy = sinon.spy();
    const testError = 'too much tabasco';
    const fsStub = {
      readdir: (path, callback) => {
        callback(testError);
      }
    };
    
    function fileTypeSub() {
      return {ext: '.png'};
    }
    
    // eslint-disable-next-line prefer-const
    let getSingleFile = proxyquire('./getSingleFile', {
      'file-type': fileTypeSub,
      'path': pathStub,
      'fs': fsStub
    });
    
    getSingleFile(req, {}, nextSpy);
    
    expect(nextSpy.calledWith(testError), 'next not called with error').to.equal(true);
    done();
  });
});
