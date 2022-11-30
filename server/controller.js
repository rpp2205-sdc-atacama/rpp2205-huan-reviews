const pool = require('./db/schema.js');

module.exports = {
  getReviewMeta: (req, res) => {
    const product_id = req.params.product_id;
    const queryString = `SELECT json_build_object(
      'product_id', ${product_id},
      'characteristics', (SELECT json_object_agg("type", char_detail.char_data) FROM
        (SELECT "type", json_build_object(
          'id', char_avg.id,
          'value', char_avg.value
        ) AS char_data FROM (
          SELECT
            CASE
              WHEN "type" = 'Comfort' THEN '${product_id}-Comfort'
              WHEN "type" = 'Fit' THEN '${product_id}-Fit'
              WHEN "type" = 'Length' THEN '${product_id}-Length'
              WHEN "type" = 'Quality' THEN '${product_id}-Quality'
              WHEN "type" = 'Size' THEN '${product_id}-Size'
              WHEN "type" = 'Width' THEN '${product_id}-Width'
            END AS id, "type", avg(value) AS value FROM characteristics WHERE product_id = ${product_id} GROUP BY "type"
          ) AS char_avg
        ) AS char_detail
      ),
      'ratings', (
        SELECT json_object_agg("rating", count) FROM (
          SELECT rating, count(rating) as count FROM reviews WHERE product_id = ${product_id} GROUP BY rating
        ) AS rating_table
      ),
      'recommended', (
        SELECT json_object_agg(recommended, count) FROM (
          SELECT recommended, count(recommended) as count FROM reviews WHERE product_id = ${product_id} GROUP BY recommended
        ) AS recommended_table
      )
    )`;
    return pool.query(queryString)
      .then(result => {
        console.log('Review meta: ', result.rows[0].json_build_object)
        res.status(200).json(result.rows[0].json_build_object);
      })
      .catch(err => {
        console.log('Getting review meta error: ', err);
        res.status(404).json(err);
      })
  },

  getReviews: (req, res) => {
    const product_id = req.params.product_id;
    const count = req.params.count || null;
    let sort = '';
    switch (req.params.sort) {
      case 'relevance':
        sort = 'reviews.date DESC, helpfulness DESC'
        break;
      case 'relevant':
        sort = 'reviews.date DESC, helpfulness DESC'
        break;
      case 'newest':
        sort = 'reviews.date DESC';
        break;
      case 'helpful':
        sort = 'helpfulness DESC'
        break;
      default:
        sort = 'reviews.id DESC'
    }
    const queryString = `
    SELECT json_agg(reviews_info) FROM (
      SELECT reviews.id AS review_id, summary, body, date, helpfulness, rating, recommended AS recommend, reviewer_name, response, (
        SELECT coalesce(json_agg(photos), '[]'::json) FROM (
          SELECT id, url FROM photos WHERE review_id = reviews.id) photos
      ) AS photos FROM reviews
      WHERE product_id = ${product_id}
      ORDER BY ${sort}
      LIMIT ${count}
    ) reviews_info`
    return pool.query(queryString)
      .then(result => {
        console.log('Reviews: ', result.rows[0].json_agg)
        res.status(200).json(result.rows[0].json_agg);
      })
      .catch(err => {
        console.log('Getting reviews error: ', err);
        res.status(404).json(err);
      })
  },

  postReview: (req, res) => {

  },

  updateReviewReport: (req, res) => {

  },

  updateReviewHelpfulness: (req, res) => {

  }
}