# Copyright (C) 2017 DataArt
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import logging.config
import os
import threading
import time

import numpy as np
from scipy.io import wavfile

from audio.captor import Captor
from audio.processor import WavProcessor, format_predictions
from log_config import LOGGING
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
import configparser

parser = argparse.ArgumentParser(description='Capture and process audio')
parser.add_argument('--min_time', type=float, default=5, metavar='SECONDS',
                    help='Minimum capture time')
parser.add_argument('--max_time', type=float, default=7, metavar='SECONDS',
                    help='Maximum capture time')
parser.add_argument('-s', '--save_path', type=str, metavar='PATH',
                    help='Save captured audio samples to provided path',
                    dest='path')

logging.config.dictConfig(LOGGING)
logger = logging.getLogger('audio_analysis.capture')

config = configparser.ConfigParser()
config.read('config.ini')


class Capture(object):
    _ask_data = None
    _captor = None
    _save_path = None
    _processor_sleep_time = 0.01
    _process_buf = None
    _sample_rate = 16000

    def __init__(self, min_time, max_time, path=None):
        if path is not None:
            if not os.path.exists(path):
                raise FileNotFoundError('"{}" doesn\'t exist'.format(path))
            if not os.path.isdir(path):
                raise FileNotFoundError('"{}" isn\'t a directory'.format(path))
        self._save_path = path
        self._ask_data = threading.Event()
        self._captor = Captor(min_time, max_time,
                              self._ask_data, self._process)

    def start(self):
        self._captor.start()
        self._process_loop()

    def _process(self, data):
        self._process_buf = np.frombuffer(data, dtype=np.int16)

    def _process_loop(self):
        with WavProcessor() as proc:
            self._ask_data.set()
            try:
                producer = KafkaProducer(
                    bootstrap_servers=config['KAFKA']['bootstrap_servers'])
            except NoBrokersAvailable:
                producer = None
                print("No brokers available, running off-line")

            while True:
                if self._process_buf is None:
                    # Waiting for data to process
                    time.sleep(self._processor_sleep_time)
                    continue

                self._ask_data.clear()
                if self._save_path:
                    f_path = os.path.join(
                        self._save_path, 'record_{:.0f}.wav'.format(time.time()))
                    wavfile.write(f_path, self._sample_rate, self._process_buf)

                predictions = proc.get_predictions(
                    self._sample_rate, self._process_buf)

                for prediction in predictions:
                    if prediction[1] > 0.4:
                        if producer is not None:
                            producer.send(config['KAFKA']['topic'], bytes(
                                str(prediction[0]).encode()))
                        print(prediction[0])

                self._process_buf = None
                self._ask_data.set()


if __name__ == '__main__':
    args = parser.parse_args()
    c = Capture(**vars(args))
    c.start()
