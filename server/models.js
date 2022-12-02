const {Client} = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'huantran',
  database: 'sdc',
  password: ''
});

client.connect((err) => {
  if (err) {
    console.error('connect error: ', err.stack)
  } else {
    console.log('connected!')
  }
})

const handlers = {
  getReviewMetaHandler: async (product_id) => {
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
    try {
      const result = await client.query(queryString)
      const reviewMeta = result.rows[0].json_build_object;
      console.log('Review meta: ', reviewMeta);
      return reviewMeta;
    }
    catch (err) {
      console.log('Getting review meta error: ', err);
      throw err;
    }
  },

  getReviewsHandler: async (product_id, count, sort) => {
    var orderBy = '';
    switch (sort) {
      case 'relevance':
        orderBy = 'reviews.date DESC, helpfulness DESC'
        break;
      case 'relevant':
        orderBy = 'reviews.date DESC, helpfulness DESC'
        break;
      case 'newest':
        orderBy = 'reviews.date DESC';
        break;
      case 'helpful':
        orderBy = 'helpfulness DESC'
        break;
      default:
        orderBy = 'reviews.id DESC'
    }
    const queryString = `
    SELECT json_agg(reviews_info) FROM (
      SELECT reviews.id AS review_id, summary, body, date, helpfulness, rating, recommended AS recommend, reviewer_name, response, (
        SELECT coalesce(json_agg(photos), '[]'::json) FROM (
          SELECT id, url FROM photos WHERE review_id = reviews.id) photos
      ) AS photos FROM reviews
      WHERE product_id = ${product_id} AND reported = false
      ORDER BY ${orderBy}
      LIMIT ${count}
    ) reviews_info`
    try {
      const result = await client.query(queryString)
      const reviewList = result.rows[0].json_agg;
      console.log('Reviews: ', reviewList)
      return reviewList;
    }
    catch (err) {
      console.log('Getting reviews error: ', err);
      throw err;
    }
  },

  postPhotoHandler: async (photoUrl, review_id) => {
    const queryString = `
      INSERT INTO photos(id, url, review_id)
      VALUES(nextval('photo_seq'), '${photoUrl}', ${review_id})`
    try {
      await client.query(queryString)
    }
    catch (err) {
      console.log('Posting photo: ', err);
      throw err;
    }
  },

  postCharacteristic: async(type, value, review_id, product_id) => {
    const queryString = `
      INSERT INTO characteristics(id, type, value, review_id, product_id)
      VALUES(nextval('characteristic_seq'), '${type}', ${value}, ${review_id}, ${product_id})`
    try {
      await client.query(queryString)
    }
    catch (err) {
      console.log('Posting characteristic: ', err);
      throw err;
    }

  },

  postReviewHandler: async (reviewObj, photoArr, characteristicsObj) => {
    const {product_id, rating, summary, body, recommend, name, email} = reviewObj;
    const postReviewString = `
      INSERT INTO reviews(id, summary, body, rating, reviewer_name, reviewer_email, recommended, product_id)
      VALUES(nextval('review_seq'), '${summary}', '${body}', ${rating}, '${name}', '${email}', ${recommend}, ${product_id}) RETURNING id;`
    try {
      const newReview = await client.query(postReviewString);
      const review_id = newReview.rows[0].id;
      if (photoArr.length > 0) {
        for (var i = 0; i < photoArr.length; i++) {
          await handlers.postPhotoHandler(photoArr[i], review_id);
        }
        console.log('Successfully store all photos')
      }
      for (var key in characteristicsObj) {
        const [productId, type] = key.split('-');
        await handlers.postCharacteristic(type, characteristicsObj[key], review_id, Number(productId))
      }
      console.log('Successfully store all characteristics')
      console.log('Successfully save review')
    }
    catch (err) {
      throw err;
    }
  },

  updateReviewReportHandler: async(review_id) => {
    const queryString = `UPDATE reviews SET reported = true WHERE id = ${review_id};`
    try {
      await client.query(queryString);
      console.log('Successfully reported')
    }
    catch (err) {
      throw err;
    }
  },

  updateReviewHelpfulnessHandler: async(review_id) => {
    const queryString = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id};`
    try {
      await client.query(queryString);
      console.log('Successfully update helpfulness')
    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = handlers;