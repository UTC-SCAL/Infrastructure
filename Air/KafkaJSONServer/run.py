from flask import Flask, abort, request, jsonify, current_app
import json
import configparser
from threading import Thread
from confluent_kafka import Consumer, KafkaError
from functools import wraps
import time
from datetime import datetime

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

peeples = []
central = []
douglas = []
magnolia = []


def support_jsonp(f):
    """Wraps JSONified output for JSONP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(f().data.decode()) + ')'
            return current_app.response_class(content, mimetype='application/json')
        else:
            return f(*args, **kwargs)
    return decorated_function


@app.route('/api', methods=['GET', 'HEAD'])
@support_jsonp
def foo():
    d = {
        "peeples": peeples,
        "central": central,
        "douglas": douglas,
        "magnolia": magnolia
    }
    return jsonify(d)


def main():
    config = configparser.ConfigParser()
    config.read('config.ini')

    consumer = Consumer({
        'bootstrap.servers': config['KAFKA']['bootstrap_servers'],
        'group.id': 'flask_pa_consumer',
        'auto.offset.reset': 'latest'
    })

    consumer.subscribe([
        config['KAFKA']['peeples_topic'],
        config['KAFKA']['central_topic'],
        config['KAFKA']['douglas_topic'],
        config['KAFKA']['magnolia_topic']
    ])

    while True:
        try:
            msg = consumer.poll(1.0)
            if (not msg):
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print("Kafka error: {}".format(msg.error()))
                    continue


            to_modify = None
            json_msg = json.loads(msg.value().decode('utf-8'))

            if json_msg["SensorId"] == "84:f3:eb:44:d8:24":
                to_modify = central
            elif json_msg["SensorId"] == "84:f3:eb:91:44:60":
                to_modify = douglas
            elif json_msg["SensorId"] == "84:f3:eb:91:44:38":
                to_modify = peeples
            elif json_msg["SensorId"] == "84:f3:eb:45:1a:53":
                to_modify = magnolia

            to_modify.append((json_msg["pm2_5_atm"], str(datetime.fromtimestamp(time.time()))))

            # keep only 50 messages for memory purposes
            if len(to_modify) > 50:
                del to_modify[0]

        except KeyboardInterrupt:
            break
    consumer.close()

if __name__ == "__main__":
    MAIN_THREAD = Thread(target=main)
    MAIN_THREAD.start()
    app.run(host='0.0.0.0', port=3100, threaded=True, debug=False)

