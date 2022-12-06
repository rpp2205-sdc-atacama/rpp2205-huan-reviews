import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1000,
  duration: "30s"
};

export default function() {
  const url = 'http://localhost:8000';
  let product_id = Math.floor(Math.random() * 100000) + 900000
  let res = http.get(`${url}/reviews/${product_id}/500/relevant`);
  check(res, {
    "success": (r) => r.status == 200
  });
};