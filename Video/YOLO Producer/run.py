from darkflow.net.build import TFNet
from kafka import KafkaProducer
import cv2


def get_color_from_label(label):
    label_cp = label
    ord_sum = ''
    for letter in label_cp:
        ord_sum += str(ord(letter))
    while len(ord_sum) % 3 is not 0:
        ord_sum += '6'
    first_splice = int(len(ord_sum) / 3)
    second_splice = int(2 * first_splice)
    r = int(ord_sum[0:first_splice]) % 256
    g = int(ord_sum[first_splice:second_splice]) % 256
    b = int(ord_sum[second_splice:]) % 256
    return b, g, r


def get_yolo_results(tfnet, frame):
    """Get the TFNet reuslts without drawing"""
    return tfnet.return_predict(frame)


def get_and_draw_yolo_results(tfnet, frame):
    """Get the TFNet results and draw them"""
    results = tfnet.return_predict(frame)
    frame = draw_yolo_results(results, frame)
    return frame, results


def draw_yolo_results(results, img):
    """Draw the YOLO results on the frame"""
    for result in results:
        x = result['topleft']['x']
        y = result['topleft']['y']
        w = result['bottomright']['x'] - x
        h = result['bottomright']['y'] - y
        cv2.rectangle(img, (x, y), (x + w, y + h), (get_color_from_label(result['label'])), 4)
        cv2.putText(img, "{}: {}".format(result['label'], "%.2f" % result['confidence']), (x, y - 16),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (get_color_from_label(result['label'])), 1)
    return img


def main(tfnet, producer):
    cap = cv2.VideoCapture()
    cap.open(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    while True:
        try:
            ret, frame = cap.read()
            if not ret:
                continue
            frame, results = get_and_draw_yolo_results(tfnet, frame)
            cv2.imshow("YOLO Results", frame)
            key = cv2.waitKey(1) & 0XFF
            if key == ord('q'):
                break
            for result in results:
                producer.send("YOLO_test", bytes(str(
                    "{} at {},{} to {},{} with {}% confidence".format(result['label'],
                                                                      result['topleft']['x'],
                                                                      result['topleft']['y'],
                                                                      result['bottomright']['x'],
                                                                      result['bottomright']['y'],
                                                                      result['confidence'])).encode()))
        except KeyboardInterrupt:
            break
    cv2.destroyAllWindows()
    cap.release()


if __name__ == "__main__":
    tfnet = TFNet({"model": "cfg/yolo.cfg", "load": "weights/yolov2.weights", "threshold": 0.6, "gpu": 1.0})
    producer = KafkaProducer(bootstrap_servers='sckafka1.simcenter.utc.edu:9092')
    main(tfnet, producer)
