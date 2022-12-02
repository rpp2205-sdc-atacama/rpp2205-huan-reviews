const pool = require('./db/schema.js');
const { getReviewMetaHandler,
        getReviewsHandler,
        postReviewHandler,
        updateReviewReportHandler,
        updateReviewHelpfulnessHandler
      } = require('./models');

module.exports = {
  getReviewMeta: async (req, res) => {
    const product_id = req.params.product_id;
    try {
      const reviewMeta = await getReviewMetaHandler(product_id);
      res.status(200).json(reviewMeta);
    }
    catch (err) {
      res.status(404).send(err)
    }
  },

  getReviews: async (req, res) => {
    const product_id = req.params.product_id;
    const count = req.params.count || null;
    const sort = req.params.sort;
    console.log(count)
    try {
      const reviewList = await getReviewsHandler(product_id, count, sort);
      const result = {
        product: product_id,
        page: 1,
        count: count,
        results: reviewList
      }
      res.status(200).json(result);
    }
    catch (err) {
      res.status(404).send(err)
    }
  },

  postReview: async (req, res) => {
    const reviewObj = {
      product_id: req.body.product_id,
      rating: req.body.rating,
      summary: req.body.summary,
      body: req.body.body,
      recommend: req.body.recommend,
      name: req.body.name,
      email: req.body.email
    };
    try {
      await postReviewHandler(reviewObj, req.body.photos, req.body.characteristics)
      res.status(201).send('New review add!')
    }
    catch (err) {
      res.status(400).send(err)
    }
  },

  updateReviewReport: async (req, res) => {
    try {
      await updateReviewReportHandler(req.params.review_id);
      res.status(204).send('Successfuly reported')
    }
    catch (err) {
      res.status(400).send(err)
    }
  },

  updateReviewHelpfulness: async (req, res) => {
    try {
      await updateReviewHelpfulnessHandler(req.params.review_id);
      res.status(204).send('Successfuly update helpfulness')
    }
    catch (err) {
      res.status(400).send(err)
    }
  }
}