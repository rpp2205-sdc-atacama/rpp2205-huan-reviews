# Atelier Ratings & Reviews | Back-end services for e-commerce web app

Our 3 software engineers rebuilt back-end API service for a monolithic to service-oriented micorservices to support our existing e-commerce site in this project. The service I built was scaled to meet the demands of production traffic with 6000RPS with < 40ms response time with 0% error rate.

## Techonologies Used

Backend Development: Node.js | Express | Postgres | NGINX
</br>
Deployement: Docker | AWS EC2
</br>
Testing: Jest | SuperTest | K6 | Loader.io

---
## Table of Contents
  - <a href='#system-design'>System Design</a>
  - <a href='#usage'>Usage</a>
  - <a href='#db-initialization-and-etl-quaries-in-postgres'>DB Initialization and ETL Quaries in Postgres</a>
  - <a href='#installation'>Installation</a>
  - <a href='#other-services'>Other Services</a>
 
---
## System Design
  ### Database Design
  ![reviews_schema_design](https://user-images.githubusercontent.com/103070104/201466345-60016a5d-a7a3-4177-a108-c3fa5c77ea0e.png)
  
  ### Architecture
  ![Architecture](https://user-images.githubusercontent.com/103070104/212256802-39dafe44-7b74-48a6-a607-ccceb319c2cd.png)

  
   ### Stress Test Results via Loader.io
   ![1000 RPS](https://user-images.githubusercontent.com/103070104/210714539-e7b419f7-2e9b-4255-92bd-d3ac017fbef6.png)
   ![3000 RPS](https://user-images.githubusercontent.com/103070104/210714775-f82f3d7f-cc1d-4d75-9282-0e5b1fab7445.png)
   ![6000 RPS](https://user-images.githubusercontent.com/103070104/210714852-58d9ddbb-bb11-4eb3-a4d2-a72feb3b44fe.png)
   
   ---
## Usage
  ### Review List
  Returns a list of reviews for a particular product. This list does not include any reported reviews.

  `GET /reviews/`
  
  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Specifies the product for which to retrieve reviews. |
  | page |  integer  | Selects the page of results to return. Default 1. |
  | count |  integer  | Specifies how many results per page to return. Default 5 |
  | sort |  text  | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |

  Response: `Status: 200 OK`
  
  ![Review list query](https://user-images.githubusercontent.com/103070104/204722521-1f155531-803f-4777-9bf7-81e6e607b107.jpg)

  
  ### Review Metadata
  Returns review metadata for a given product.

  `GET /reviews/meta`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the product for which data should be returned |

  Response: `Status: 200 OK`
  
  ![image](https://user-images.githubusercontent.com/103070104/212246724-1339b04b-a278-480a-b782-7c854d9aa68c.png)

 
  
  ### Add a Review
  Adds a review for the given product.

  `POST /reviews`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the product to post the review for |
  | rating |  int  | Integer (1-5) indicating the review rating |
  | summary |  text  | Summary text of the review |
  | body |  text  | Continued or full text of the review |
  | recommend |  bool  | Value indicating if the reviewer recommends the product |
  | name |  text  | Username of reviewer |
  | email |  text  | Email address of reviewer |
  | photos |  [text]  | Array of text urls that link to images to be shown |
  | characteristics |  object  | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |

  Response: `Status: 201 Created`

  
  ### Mark Review as Helpful
  Updates a review to show it was found helpful.

  `PUT /reviews/:review_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | review_id |  integer  | Required ID of the review to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Report Review
  Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.

  `PUT /reviews/:review_id/report`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | review_id |  integer  | Required ID of the review to update |

  Response: `Status: 204 NO CONTENT`
  
---
## DB Initialization and ETL Quaries in Postgres
### Local
  1. Run `node db/schema.js` to create tables
  2. Run `node db/loadingData.js` to import data from csv files (if deployed to cloud, run copyData-AWS-EC2.sql instead). Make sure to replace the file paths with your paths

### Deploy to cloud
  1. Create database
  2. Create file named `schema.sql` and copy commands from `db/schema.sql`
  3. Create file name `loadingData.sql` and copy commands from `db/loadingData.sql` 
  3. Run `psql -h localhost -U your-user-name -d your-cloud-database-name -f \schema.sql`
  4. Transfer the CSV files from local to cloud server
  5. Run `psql -h localhost -U your-user-name -d your-cloud-database-name` -f \importData.sql`
  
---
## Installation
  1. In the terminal inside, run `npm run server/index.js` to start server
  2. Test by typing `http://localhost:8000/reviews?product_id=1` in the Postman to see the response.
  
---
## Other Services
Please reference other API Services that make up the other part of the e-commerce app API:
  
  - <a href='https://github.com/rpp2205-sdc-atacama/rpp2205-yui-overview'>Product Overviews</a> by Yui Murayama
  
  - <a href='https://github.com/rpp2205-sdc-atacama/rpp2205-yuchen-QA'>Q&A</a> by Yuchen Pan
