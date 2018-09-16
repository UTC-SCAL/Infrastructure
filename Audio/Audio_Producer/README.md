Audio_Producer
------------

This is a Kafka_Producer used to publish raw audio to the kafka cluster. Sample size, and Kafka configurations can managed in the configuration file.

To run the Audio_Producer make sure you have 'pipenv' installed. Than:

'pipenv install wave'
'pipenv install pyaudio'


Then run:
'pipenv run python Audio_Producer.py'
