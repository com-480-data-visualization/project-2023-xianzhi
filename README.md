# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
|Xingchen Li|346424|
|Mariella Daghfal|301547|
|Mengjie Zou|359754|

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (7th April, 5pm)

### Dataset

The dataset we are going to use is the Airbnb dataset, which can be found on Kaggle [1]: https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data.
This dataset includes host, hostname, neighbourhood_group, latitude, longitude, minimum nights, number of reviews, last review, and the availability in 365 days in 2019 in the city of New York.
In addition, we are going to use supplementary data, potentially including the more updated data we acquired from the official Airbnb APIs, the 3D digital model of the region of interest, etc.


### Problematic

#### What we want to show:

Our visualization aims to present the data in 3D space rather than on traditional 2D planes and maps, in order to give the viewer a more intuitive comprehension of the information in our dataset. Additionally, we are going to align the data with actual geographic positions, sites of interest, and a 3D view of the region to better exhibit the dataset.
Different layers of information can be shown with our dataset. For instance, we can show the pricing as 3D models with different heights in the 3D city map. Or, we can show the availability as the size of the model, and for different city regions, the models or data belonging to these regions can have different colors.

#### Project overview:

We plan to build a user-friendly and aesthetically pleasing web page that is based on historical Airbnb data. By mainly implementing a 3D interactive map of the region of interest, which incorporates the colored map of the 3D city with different layers of information, we hope to present an intuitive way to demonstrate the data for users with different needs.

Our motivation is that, firstly, we think the traditional 2D view of Airbnb's official website is neither intuitive nor informative, and we want to create a different visualization that not only contains denser information but is also easy for the users to get a total understanding of the Airbnb market in the region. Secondly, since we have the data with geographic information, inspired by the 3D region map on Flourish [2], we think it would be interesting to combine 3D city views with our data.

Our target audiences could be:
* People who want a more informative map of the regional Airbnb market.
* Customers or researchers who want to get a comprehensive view at the regional patterns (pricing, availability) in Airbnb.
* Landlords who want to know the neighboring or regional information to help set the prices. 

### Exploratory Data Analysis

In our initial analysis, we found that:

Our dataset consists of 48,895 records, all of which are clean and valid, meaning there is no missing or corrupted data. The dataset includes information about 5 different city districts, which are 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island', and 'Bronx'. There are a total of 221 different neighborhoods included in the dataset. The types of rooms available for rent are 'Private room', 'Entire home/apt', and 'Shared room'. 

For different districts, both average prices and median prices are different. Among all the districts, Manhattan has the highest mean price of 196.8 while the Bronx has the lowest mean price of 87.49



As for room types, most of the rooms are entire homes or apartments, there are slightly fewer rooms being private rooms, and shared rooms are significantly rare.


We also found that the number of reviews is correlated with price. The higher the price, the lower the number of reviews.



These initial statistics give us a general understanding of the scope and contents of our dataset. We can use this information as a starting point to further explore and analyze the data.


### Related work
In Kaggle, we can easily find some works that are based on this specific data set, like Understand your data 🎲 | airbnb reservations [3], Data Exploration on NYC Airbnb [4], Airbnb Analysis, Visualization and Prediction [5]. The previous works mainly analyze the 
statistical properties of the dataset rather than visualize them.  While they also provide lots of fancy data demonstrations like Fig 1[3] and Fig 2 [3]  have shown.


Fig. 1 The 10 most frequent neighborhoods in the dataset



Fig.2 Location distribution of rooms on Airbnb

Although previous works provide us with a lot of inspiration for the project, we think our approach is original for the reason that instead of just demonstrating the statistical properties of the dataset in different charts, we will also use the map with a 3D model of the data, which can not only provide the geographic information but also provide an intuitive feeling towards the data. We believe, in this way, users can have a better interaction with the data and our web page. 

#### References:
* [1] https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data
* [2] 
* [3] https://www.kaggle.com/code/upadorprofzs/understand-your-data-airbnb-reservations
* [4] https://www.kaggle.com/code/dgomonov/data-exploration-on-nyc-airbnb
* [5] https://www.kaggle.com/code/chirag9073/airbnb-analysis-visualization-and-prediction



## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

