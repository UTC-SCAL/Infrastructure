# SCAL Infrastructure Project

## Overview

The purpose of this GitHub Repository is to serve as a contribution grounds for our overall project. This repository encompasses *all* of the University of Tennessee at Chattanooga's testbed development and expansion. The testbed expansion will include many new pieces of hardware and will span several blocks along [MLK Blvd.](https://www.google.com/maps/place/35%C2%B002'36.1%22N+85%C2%B018'06.6%22W/@35.043364,-85.303362,17z/data=!3m1!4b1!4m9!1m2!2m1!1smlk+blvd+chattanooga!3m5!1s0x0:0x0!7e2!8m2!3d35.0433614!4d-85.3018453?hl=en).

## Data Flow Schematic

![](https://i.imgur.com/nVifZL2.png)

## Network Schematic

![](https://i.imgur.com/YnIDyGN.png)

## Contributing

### Branches:

This repository has three branches:

1. `production`: modules that are complete **with Kafka integration**.
2. `dev`: modules that are WIP or lack Kafka integration.
3. `demo`: module web-demos that may or may not use Kafka at all

___

UTC members can (after being added to this repository officially) modify the master branch as they wish. Any large or unstable changes made are *suggested* to be placed in a separate branch of the main repository (such as "unstable-mm/dd/yy" or "unstable-cam_addition", something of the sort that makes it discernable). 

Non-UTC members can start contributing by forking this repository and creating Pull Requests. Any changes you make should be managed on *your* fork of the repository (and make sure to keep up to date with this fork too, to avoid merge conflicts!). There are no limitations to contributions, but they **must** include:

1. What sensor is being added / modified
2. What programming language & libraries are being utilized
3. What other hardware is necessary to run this (such as dedicated RasPi, compute node, etc.)

Along with this, each sensor should have its own subfolder in this repository. For example, when cloning the repository, an ls of the directory should look like this:

    Purple Air PAII
    Axis ...
    .
	.
	.
	README.md
In other words, should you add a new sensor then you should be adding a new directory containing ***everything*** inside it that is necessary to get it running. Each device's folder should have its own `README.md` file containing instructions on how to run this particular section of code.