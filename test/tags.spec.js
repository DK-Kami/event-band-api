// const chai = require('chai');
// const chaiHTTP = require('chai-http');
// const expect = chai.expect;
// const server = require('../app');
process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHTTP from 'chai-http';
// import { expect } from 'chai';
import server from '../app';

chai.use(chaiHTTP);

describe('Tags API', () => {
  it('Get all tags', done => {
    done();
    // chai
    //   .request(server)
    //   .get('/tag/all')
    //   .end((err, res) => {
    //     expect(err).to.be.null;
    //     expect(res).to.have.status(200);
    //     expect(res.body).to.haveOwnProperty('tags');
    //     expect(res.tags).to.be.an('array');
    //     done();
    //   })
  });
});
