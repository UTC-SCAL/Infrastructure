# Overview

Uses a camera feed to count the running total of people, cars and busses using OpenCV and a Caffe model by the folks at PyImageSearch.

# Setup

### Primary Language Used: Python 3

**You can use Pipenv with this repository** (recommended), optionally:

## Dependencies:

    conda install -c conda-forge opencv
	conda install -c mlgill imutils 
    conda install -c menpo dlib 
    conda install -c anaconda scipy 

## Running

Run with the command:

`pipenv run python run.py -p mobilenet_ssd/MobileNetSSD_deploy.prototxt -m mobilenet_ssd/MobileNetSSD_deploy.caffemodel`, or

`python run.py -p mobilenet_ssd/MobileNetSSD_deploy.prototxt -m mobilenet_ssd/MobileNetSSD_deploy.caffemodel` if using Conda