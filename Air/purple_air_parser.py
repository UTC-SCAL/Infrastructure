from flask import Flask, abort, request
import json
from kafka import KafkaProducer
import configparser

app = Flask(__name__)
config = configparser.ConfigParser();
config.read('config.ini')
producer = KafkaProducer(bootstrap_servers=config['KAFKA']['bootstrap_servers'])

@app.route('/api', methods=['POST'])
def foo():
    if not request.json:
        abort(400)
    producer.send(config['KAFKA']['topic'], bytes(str(request.get_data()).encode()))
    return ('', 200)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)