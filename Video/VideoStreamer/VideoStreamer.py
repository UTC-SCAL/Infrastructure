"""VideoStreamer producers raw video streams to a Kafka topic specified in the config file."""
import time
import cv2
from kafka import KafkaProducer
#  connect to Kafka
producer = KafkaProducer(bootstrap_servers='BOOTSTRAP_SERVERS_HERE')
# Assign a topic
topic = 'TOPIC_NAME_HERE'


def video_emitter(video):
    # Open the video
    video = cv2.VideoCapture(video)
    # read the file
    while (video.isOpened):
        # read the image in each frame
        success, image = video.read()
        # check if the file has read to the end
        if not success:
            break
        # convert the image png
        ret, jpeg = cv2.imencode('.png', image)
        # Convert the image to bytes and send to kafka
        producer.send(topic, jpeg.tobytes())
        # To reduce CPU usage create sleep time of 0.2sec
        time.sleep(0.2)
    # clear the capture
    video.release()


if __name__ == '__main__':
    video_emitter('CAMERA_IP_ADDRESS')
