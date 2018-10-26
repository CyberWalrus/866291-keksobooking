'use strict';

const path = require(`path`);

const IllegalArgumentError = require(`../error/illegal-argument-error`);
const NotFoundError = require(`../error/not-found-error`);
const ValidationError = require(`../error/validation-error`);

const offerPath = path.resolve(`keksobooking.json`);
const offer = require(offerPath);

const DEFAULT_SKIP = 0;
const DEFAUL_LIMIT = 20;

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
const getObjectOffers = (array, skip, limit) => {
  return {
    'data': array.slice(skip, skip + limit),
    'skip': skip,
    'limit': limit,
    'total': array.slice(skip, skip + limit).length
  };
};

module.exports = (app) => {
  app.get(`/api/offers`, (req, res) => {
    let skip = DEFAULT_SKIP;
    let limit = DEFAUL_LIMIT;
    if (req.query.skip) {
      skip = req.query.skip;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    res.send(getObjectOffers(offer, skip, limit));
  });
  app.get(`/api/offers/:date`, (req, res) => {
    const offerDate = req.params.date;
    if (!offerDate) {
      throw new IllegalArgumentError(`В запросе не указана дата`);
    }
    const date = parseInt(offerDate, 10);
    if (!isNumber(date)) {
      throw new IllegalArgumentError(`В запросе указана неправельный формат даты`);
    }
    const found = offer.find((it) => it[`date`] === date);
    if (!found) {
      throw new NotFoundError(`Обьект с датой "${offerDate}" не найден`);
    }

    res.send(found);
  });
  app.use((err, req, res, _next) => {
    if (err instanceof ValidationError) {
      res.status(err.code).json(err.errors);
    }
  });
};
