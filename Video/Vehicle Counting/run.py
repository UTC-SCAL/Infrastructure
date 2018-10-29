""""""
import argparse

import cv2
import imutils
import numpy as np
from imutils.video import FPS

import dlib
from pyimagesearch.centroidtracker import CentroidTracker
from pyimagesearch.trackableobject import TrackableObject


def main(args):
    classes = ["background", "aeroplane", "bike", "bird", "boat", "bottle", "bus", "car", "cat", "chair", "cow",
               "dining_table", "dog", "horse", "motorbike", "person", "pottedplant", "sheep", "sofa", "train", "tvmonitor"]
    net = cv2.dnn.readNetFromCaffe("./bin/prototxt.prototxt", "./bin/model.caffemodel")

    cap = cv2.VideoCapture()
    cap.open("http://root:B1XWQb^r58nE@Xw@10.199.51.32/axis-cgi/mjpg/video.cgi?resolution=480x270")
    ct = CentroidTracker(maxDisappeared=40, maxDistance=50)

    width, height = None, None
    total_frames, total_up, total_down = 0, 0, 0
    trackers = []
    trackable_objects = {}

    fps = FPS().start()

    while True:
        try:
            ret, frame = cap.read()

            if not ret:
                continue

            # frame = imutils.resize(frame, width=500)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            if width is None or height is None:
                (height, width) = frame.shape[:2]

            status = "Waiting"
            rects = []

            if total_frames % args["skip_frames"] == 0:
                status = "Detecting"
                trackers = []

                blob = cv2.dnn.blobFromImage(
                    frame, 0.007843, (width, height), 127.5)
                net.setInput(blob)
                detections = net.forward()

                for i in np.arange(0, detections.shape[2]):
                    confidence = detections[0, 0, i, 2]
                    if confidence > args["confidence"]:
                        idx = int(detections[0, 0, i, 1])
                        if classes[idx] != "person" and classes[idx] != "car" and classes[idx] != "bus":
                            continue
                        box = detections[0, 0, i, 3:7] * \
                            np.array([width, height, width, height])
                        (startX, startY, endX, endY) = box.astype("int")
                        tracker = dlib.correlation_tracker()
                        rect = dlib.rectangle(startX, startY, endX, endY)
                        tracker.start_track(rgb, rect)
                        trackers.append(tracker)
            else:
                for tracker in trackers:
                    status = "Tracking"
                    tracker.update(rgb)
                    pos = tracker.get_position()

                    startX = int(pos.left())
                    startY = int(pos.top())
                    endX = int(pos.right())
                    endY = int(pos.bottom())

                    rects.append((startX, startY, endX, endY))

            cv2.line(frame, (0, height//2),
                     (width, height//2), (0, 255, 255), 2)
            objects = ct.update(rects)

            for (objectID, centroid) in objects.items():
                to = trackable_objects.get(objectID, None)
                if to is None:
                    to = TrackableObject(objectID, centroid)
                else:
                    y = [c[1] for c in to.centroids]
                    direction = centroid[1] - np.mean(y)
                    to.centroids.append(centroid)

                    if not to.counted:
                        if direction < 0 and centroid[1] < height//2:
                            total_up += 1
                            to.counted = True
                        elif direction > 0 and centroid[1] > height//2:
                            total_down += 1
                            to.counted = True
                trackable_objects[objectID] = to

                text = "ID {}".format(objectID)
                cv2.putText(frame, text, (centroid[0] - 10, centroid[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(
                    frame, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)

            info = [
                ("West", total_up),
                ("East", total_down),
                ("Status", status)
            ]

            for (i, (k, v)) in enumerate(info):
                text = "{}:{}".format(k, v)
                cv2.putText(frame, text, (10, height - ((i * 20) + 20)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

            cv2.imshow("Frame", frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                break
            total_frames += 1
            fps.update()

        except KeyboardInterrupt:
            break

    fps.stop()
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-c", "--confidence", type=float, default=0.4,
                    help="minimum probability to filter weak detections")
    ap.add_argument("-s", "--skip-frames", type=int, default=30,
                    help="number of skip frames between detections")
    ag = vars(ap.parse_args())
    main(ag)
