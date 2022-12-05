const axios = require('axios');
const request = require("supertest");
const server = require("../server/index.js");
// require("dotenv").config();
// const url = `http://localhost:${process.env.PORT}/reviews`;
const product_id = 2;

// jest.setTimeout(20000);

test('test getReviews', async() => {
  const count = 500;
  const sort = 'relevant'
  try {
    const response = await request(server).get(`/reviews/${product_id}/${count}/${sort}`)
    const reviewList = response.body.results;
    expect(response.statusCode).toBe(200);
    expect(reviewList.length).toBe(5);
    expect(reviewList[0].review_id).toBeDefined();
    // const response = await axios.get(`${url}/${product_id}/${count}/${sort}`);
    // expect(response.config.method).toBe('get');
    // expect(response.data.results.length).toBe(5);
    // expect(response.data.results[0].review_id).toBeDefined();
  }
  catch (err) {
    console.log(err)
    throw err;
  }
})

test('test getReviewMeta', async() => {
  try {
    const response = await request(server).get(`/reviews/meta/${product_id}`)
    const reviewMeta = response.body;
    expect(response.statusCode).toBe(200);
    expect(reviewMeta.product_id).toBe(product_id);
    expect(reviewMeta.ratings).toBeDefined();
    // const response = await axios.get(`${url}/meta/${product_id}`);
    // expect(response.config.method).toBe('get');
    // expect(response.data.product_id).toBe(product_id);
    // expect(response.data.ratings).toBeDefined();
  }
  catch (err) {
    console.log(err)
    throw err;
  }
})

test('test postReview', async() => {
  const review = {
    product_id: 7,
    rating: 5,
    summary: 'Looks fabulous',
    body: 'My wife loves it. Gotta buy more',
    recommend: true,
    name: 'David',
    email: 'email.lala@gmail.com',
    photos: ['https://unsplash.com/photos/jvoZ-Aux9aw', 'https://unsplash.com/photos/ukp5-rExkP4', 'https://unsplash.com/photos/DTZV8WDM1Ho'],
    characteristics: {
      '7-Comfort': 3,
      '7-Size': 4,
      '7-Width': 4
    }
  }
  try {
    const response = await request(server).post(`/reviews`).send(review)
    expect(response.statusCode).toBe(201);
    // const response = await axios.post(url, review);
    // expect(response.config.method).toBe('post');
  }
  catch (err) {
    console.log(err)
    throw err;
  }
})

test('test putReviewReport', async() => {
  const review_id = 5774959;
  try {
    const response = await request(server).put(`/reviews/${review_id}/report`).send({review_id})
    expect(response.statusCode).toBe(204);
    // const response = await axios.put(`${url}/${review_id}/report`, {review_id});
    // expect(response.config.method).toBe('put');
  }
  catch (err) {
    console.log(err)
    throw err;
  }
})

test('test putReviewHelpfulness', async() => {
  const review_id = 5774959;
  try {
    const response = await request(server).put(`/reviews/${review_id}/helpful`).send({review_id})
    expect(response.statusCode).toBe(204);
    // const response = await axios.put(`${url}/${review_id}/helpful`, {review_id});
    // expect(response.config.method).toBe('put');
  }
  catch (err) {
    console.log(err)
    throw err;
  }
})