import pandas as pd
df=pd.read_csv("./AB_NYC_2019.csv")
filtered_df = df[(df['neighbourhood_group'] == 'Staten Island') &
                 (df['number_of_reviews'].notna()) &
                 (df['last_review'].notna()) &
                 (df['reviews_per_month'].notna()) &
                 (df['availability_365'] != 0)]
sample_df = filtered_df.sample(n=100)

sample_df['last_review'] = pd.to_datetime(sample_df['last_review'])
sample_df['last_review'] = sample_df['last_review'].apply(lambda x: x.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
selected_columns = ['last_review', 'number_of_reviews', 'reviews_per_month','price','neighbourhood']
new_df = sample_df[selected_columns]

with open('output.txt', 'w',encoding='utf-8') as file:
    for index,row in new_df.iterrows():
        re="['"+row['last_review']+"',"+str(row['number_of_reviews'])+","+str(row['reviews_per_month'])+","+str(row['price'])+",'"+row['neighbourhood']+"'],"
        file.write(re+'\n')
