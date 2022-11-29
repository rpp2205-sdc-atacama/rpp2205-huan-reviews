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

app.get('/reviews/meta/:product_id', getReviewMeta);
app.get('/reviews/:product_id/:count/:sort', getReviews);
app.post('/reviews', postReview);
app.put('/reviews/:review_id/report', updateReviewReport);
app.put('/reviews/:review_id/helpful', updateReviewHelpfulness);


const PORT = 3000;
app.listen(PORT, () => {
  console.log('Listening to port ', PORT)
});