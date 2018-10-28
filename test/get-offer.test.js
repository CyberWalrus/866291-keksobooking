'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/commands/server`).app;
const DATE = 1540388535674;
const DATE_FAIL = 1;
const SKIP = 1;
const LIMIT = 2;

describe(`GET /api/offers`, () => {
  it(`get all offer`, async () => {
    const response = await request(app).
      get(`/api/offers`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const offer = response.body;

    assert.equal(offer.data.length, offer.total);
  });

  it(`get all offers with / at the end`, async () => {

    const response = await request(app).
      get(`/api/offers/`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const offer = response.body;
    assert.equal(offer.data.length, offer.total);
  });

  it(`get all offers with params`, async () => {

    const response = await request(app).
      get(`/api/offers/?skip=${SKIP}&limit=${LIMIT}`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const offer = response.body;
    assert.equal(offer.skip, SKIP);
    assert.equal(offer.limit, LIMIT);
    assert.equal(offer.data.length, offer.total);
  });

  it(`get data from unknown resource`, async () => {
    return await request(app).
      get(`/api/none`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Page was not found`).
      expect(`Content-Type`, /html/);
  });

});

describe(`GET /api/offers/:date`, () => {
  it(`get date ${DATE}`, async () => {
    const response = await request(app).
      get(`/api/offers/${encodeURI(`${DATE}`)}`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const date = response.body;
    assert.strictEqual(date.date, DATE);
  });

  xit(`get unknown date format`, async () => {
    return request(app).
      get(`/api/offers/${encodeURI(`test123`)}`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`неверный формат запроса`).
      expect(`Content-Type`, /html/);
  });

  xit(`get unknown date with ${DATE_FAIL}`, async () => {
    return request(app).
      get(`/api/offers/${encodeURI(`${DATE_FAIL}`)}`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`обьект с <<${DATE_FAIL}>> не найден`).
      expect(`Content-Type`, /html/);
  });
});
