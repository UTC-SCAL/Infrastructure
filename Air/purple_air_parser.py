import json
from kafka import KafkaProducer
import configparser



json = {'key1_count': 4261, 'pm10_0_cf_1': 1.26, 
    'current_dewpoint_f': 51.85, 'pm2_5_atm_b': 3.22, 
    'p_1_0_um_b': 17.61, 'key1_count_b': 4273, 
    'p_2_5_um_b': 3.44, 'key2_count_b': 4247, 
    'p_0_5_um_b': 135.14, 'Adc': 0.0, 
    'pm1_0_cf_1': 0.57, 'key2_responseCode_date_b': 1533670142, 
    'p_1_0_um': 11.15, 'Geo': 'AirMonitor_8c74', 
    'pm2_5_cf_1_b': 3.22, 'key2_responseCode_b': '200', 
    'key2_responseCode_date': 1533670112, 'rssi': -36, 
    'hardwarediscovered': '2.0+OPENLOG+15931MB+DS3231+BME280+PMSX003A+PMSX003B', 
    'key2_responseCode': '200', 'p_10_0_um': 0.52,
     'current_humidity': 32, 'p_5_0_um_b': 1.03, 
     'lat': 35.042767, 'pm2_5_cf_1': 1.26, 'p_0_3_um_b': 429.08,
    'key1_responseCode_date': 1533670102, 'p_0_5_um': 116.57, 
    'pm1_0_cf_1_b': 1.72, 'hardwareversion': '2.0', 
    'SensorId': '68:c6:3a:8e:8c:74', 'responseCode': '201',
    'pm10_0_atm': 1.26, 'pressure': 993.93, 
    'pm1_0_atm_b': 1.72, 'elevation': 205.05,
    'Id': 1982, 'key2_count': 4258,
    'key1_responseCode_b': '200', 'p_5_0_um': 0.78,
    'uptime': 78400, 'key1_responseCode': '200',
    'pm2_5_atm': 1.26, 'lon': -85.299385,
    'p_10_0_um_b': 0.83, 'p_2_5_um': 1.07, 
    'version': '2.50i', 'DateTime': '2018/08/07T19:29:22z',
    'key1_responseCode_date_b': 1533670132, 'pm10_0_atm_b': 3.22, 'pm1_0_atm': 0.57,
    'responseCode_date': 1533670153, 'current_temp_f': 85, 'pm10_0_cf_1_b': 3.22, 
    'accuracy': 31, 'Mem': 25400, 'p_0_3_um': 425.74}

config = configparser.ConfigParser();
config.read('config.ini')
parsed_json = json.loads(json)




def send_topic(topic, load){

}

if __name__ == '__main__':
