# Overview

Originally intended to use SoNYC, this project now uses [Device Hive's Audio Analysis](https://github.com/devicehive/devicehive-audio-analysis) as SoNYC's source code did not lead to any obvious finalized solution.

# Setup

### Primary Language Used: Python 3

## Dependencies:

This project has two system-level dependencies, `libportaudio2` and `portaudio19-dev`.

**macOS install:**

**Linux install:**

	sudo apt-get install libportaudio2
	sudo apt-get install portaudio19-dev

Alongside these system dependencies, there are also a variety of python dependencies:

	conda install -c anaconda pyaudio
	conda install -c conda-forge tensorflow-gpu
	conda install -c conda-forge resampy
	

To run this, you'll also need [this model](https://s3.amazonaws.com/audioanalysis/models.tar.gz) for analysis. It is not included in this repository as the size was too large. Unzip this tarball and place it in this directory, alongside the existing `capture.py` file and other files in that directory.