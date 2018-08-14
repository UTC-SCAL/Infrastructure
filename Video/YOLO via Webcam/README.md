# Overview

Originally intended to use SoNYC, this project now uses [Device Hive's Audio Analysis](https://github.com/devicehive/devicehive-audio-analysis) as SoNYC's source code did not lead to any obvious finalized solution.

# Setup

### Primary Language Used: Python 3

## Dependencies:

	conda install -c conda-forge kafka-python
	conda install -c conda-forge tensorflow-gpu

You will also need to download the [Darkflow](https://github.com/thtrieu/darkflow) repository, unzip it, then `cd` into the unzipped directory. Once you have, you'll need to run `pip install .` to install the current directory as a pip package. This allows you to get Darknet's utilities (including YOLO) in Python using TensorFlow.

To run this, you'll also need [this model](https://pjreddie.com/media/files/yolov2.weights) for analysis. It is not included in this repository as the size was too large. You will need to place this file in a directory called `weights` that sits alongside `run.py`.

Lastly, it is run with the command `python run.py`. The Tensorflow Network will be built and might output some logging info, but if it's working you should see video on your screen with objects outlined!