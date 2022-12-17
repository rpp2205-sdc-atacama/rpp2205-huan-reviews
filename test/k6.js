import http from "k6/http";
import { check, group } from "k6";

export let options = {
  vus: 1000,
  duration: "30s"
};

export default function() {
  const url = 'http://localhost:8000';
  let product_id = Math.floor(Math.random() * 100000) + 900000
  let review_id = Math.floor(Math.random() * 1000000) + 1000000
  const headers = { 'Content-Type': 'application/json' };

  group('get review list', () => {
    let res = http.get(`${url}/reviews/${product_id}/500/relevant`)
    check(res, {
      "get review list success": (r) => r.status == 200
    });
  })

  group('get review meta', () => {
    let res = http.get(`${url}/reviews/meta/${product_id}`)
    check(res, {
      "get review meta success": (r) => r.status == 200
    });
  })

  group('post review', () => {
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

    let res = http.post(`${url}/reviews`, JSON.stringify(review), {headers: headers})
    check(res, {
      "post review success": (r) => r.status == 201
    });
  })

  group('update report', () => {
    let res = http.put(`${url}/reviews/${review_id}/report`, JSON.stringify({review_id}), {headers: headers})
    check(res, {
      "update report success": (r) => r.status == 204
    });
  })

  group('update helpfulness', () => {
    let res = http.put(`${url}/reviews/${review_id}/helpful`, JSON.stringify({review_id}), {headers: headers})
    check(res, {
      "update report success": (r) => r.status == 204
    });
  })
};