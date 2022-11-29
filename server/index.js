const express = require('express');
const pool = require('./db/schema.js');
const {
  getReviewMeta,
  getReviews,
  postReview,
  updateReviewReport,
  updateReviewHelpfulness} = require('./controller.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'})
})

// app.get('/reviews/meta/:product_id', getReviewMeta);
// app.get('/reviews/:product_id/:count/:sort', getReviews);
// app.post('/reviews', postReview);
// app.put('/reviews/:review_id/report', updateReviewReport);
// app.put('/reviews/:review_id/helpful', updateReviewHelpfulness);

console.log('index.js');

const product_id = 2;
const count = 10 || null;
let sort = 'relevance';
switch (sort) {
  case 'relevance':
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
    SELECT json_agg(photos) FROM (
      SELECT id, url FROM photos WHERE review_id = reviews.id) photos
  ) AS photos FROM reviews
  WHERE product_id = ${product_id}
  ORDER BY ${sort}
  LIMIT ${count}
) reviews_info`
return pool.query(queryString)
  .then(result => {
    console.log('Reviews: ', result.rows[0].json_agg)
    // res.status(200).json(result.rows[0].json_build_object);
  })
  .catch(err => console.log('Getting reviews error: ', err))

// const product_id = 4;
// const queryString = `SELECT json_build_object(
//   'product_id', ${product_id},
//   'characteristics', (SELECT json_object_agg("type", char_detail.char_data) FROM
//     (SELECT "type", json_build_object(
//       'id', char_avg.id,
//       'value', char_avg.value
//     ) AS char_data FROM (
//       SELECT
//         CASE
//           WHEN "type" = 'Comfort' THEN '${product_id}-Comfort'
//           WHEN "type" = 'Fit' THEN '${product_id}-Fit'
//           WHEN "type" = 'Length' THEN '${product_id}-Length'
//           WHEN "type" = 'Quality' THEN '${product_id}-Quality'
//           WHEN "type" = 'Size' THEN '${product_id}-Size'
//           WHEN "type" = 'Width' THEN '${product_id}-Width'
//         END AS id, "type", avg(value) AS value FROM characteristics where product_id = ${product_id} GROUP BY "type"
//       ) AS char_avg
//     ) AS char_detail
//   ),
//   'ratings', (
//     SELECT json_object_agg("rating", count) FROM (
//       SELECT rating, count(rating) as count FROM reviews WHERE product_id = ${product_id} GROUP BY rating
//     ) AS rating_table
//   ),
//   'recommended', (
//     SELECT json_object_agg(recommended, count) FROM (
//       SELECT recommended, count(recommended) as count FROM reviews WHERE product_id = ${product_id} GROUP BY recommended
//     ) AS recommended_table
//   )
// )`;
// return pool.query(queryString)
//   .then(result => {
//     console.log('Review meta: ', result.rows[0].json_build_object)
//     // res.status(200).json(result.rows[0].json_build_object);
//   })
//   .catch(err => console.log('Getting review meta error: ', err))

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Listening to port ', PORT)
});