import csv
import json


def csv_to_json(csv_file_path, json_file_path):
    with open(csv_file_path, 'r',encoding='utf-8') as csv_file:
        csv_data = csv.DictReader(csv_file)
        data_list = list(csv_data)


    with open(json_file_path, 'w',encoding='utf-8') as json_file:
        json.dump(data_list, json_file, indent=4)



csv_file_path = './AB_NYC_2019.csv'
json_file_path = 'AB_NYC_2019.json'  # JSON文件路径
csv_to_json(csv_file_path, json_file_path)
