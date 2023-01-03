require("dotenv").config();
const express = require('express');
// const pool = require('./db/schema.js');
// const {getReviewMetaHandler, getReviewsHandler, postReviewHandler, updateReviewReportHandler, updateReviewHelpfulnessHandler} = require('./models.js');

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
app.get('/loaderio-bc70e5778afdb5e2af98b094fe15b402.txt', (req, res) => {
  res.sendFile('loaderio-bc70e5778afdb5e2af98b094fe15b402.txt', {root:__dirname});
})

// console.log(getReviewsHandler(2, 5, 'helpful'))
// console.log(getReviewMetaHandler(4))

// const review = {
//   product_id: 7,
//   rating: 5,
//   summary: 'Looks fabulous',
//   body: 'My wife loves it. Gotta buy more',
//   recommend: true,
//   name: 'David',
//   email: 'email.lala@gmail.com'
// }
// const photos = ['https://unsplash.com/photos/jvoZ-Aux9aw', 'https://unsplash.com/photos/ukp5-rExkP4', 'https://unsplash.com/photos/DTZV8WDM1Ho'];
// const characteristics = {
//   '7-Comfort': 3,
//   '7-Size': 4,
//   '7-Width': 4
// }
// postReviewHandler(review, photos, characteristics)

// updateReviewReportHandler(5774959);

// updateReviewHelpfulnessHandler(5774959);

const server = app.listen(process.env.PORT, () => {
  console.log('Listening to port ', process.env.PORT)
});

module.exports = server;