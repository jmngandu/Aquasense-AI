# Trash Detection AI Model

This folder contains the AI model for trash detection.

## Folder Structure
first unzip the folder TACO.v3-yolov5.yolov5pytorch.zip

- `Taco/`: Contains the dataset used for training, validation, and testing the trash detection model.
  - `train/`: Contains the training data.
    - `images/`: Contains images used for training.
    - `labels/`: Contains annotation files corresponding to the training images in YOLO format.
  - `valid/`: Contains the validation data.
    - `images/`: Contains images used for validation.
    - `labels/`: Contains annotation files corresponding to the validation images in YOLO format.
  - `test/`: Contains the test data.
    - `images/`: Contains images used for testing.
    - `labels/`: Contains annotation files corresponding to the test images in YOLO format.
  - `data.yaml`: Configuration file for the YOLO model specifying the dataset paths and class names.

- `yolov5/`: Contains the YOLOv5 model used for training and inference.
  - `data/`: Contains the dataset configuration files.
    - `waste.yaml`: Configuration file specific to the TACO dataset, detailing paths to the images and labels and the class names.
  - `models/`: Contains the YOLOv5 model architectures.
  - `train.py`: Script used to train the YOLOv5 model.
  - `detect.py`: Script used for inference with the trained YOLOv5 model.
  - `requirements.txt`: List of dependencies required to run YOLOv5.

## Dataset

The dataset used for training, validation, and testing is sourced from TACO (Trash Annotations in Context). This dataset is specifically designed for trash detection tasks and contains images of various types of trash with corresponding annotations.

### Preparing the Dataset

1. **Dataset Structure**:
   - Ensure the dataset is structured with separate directories for training, validation, and testing.
   - Each directory should contain two subdirectories: `images` and `labels`.

2. **Annotations**:
   - The annotations should be in YOLO format. Each image should have a corresponding `.txt` file in the `labels` directory.
   - Each line in the `.txt` file should follow the format: `class_id center_x center_y width height`.

### Example of Annotations

A sample annotation for an image might look like this:
0 0.5 0.5 0.1 0.1


Where:
- `0` is the class ID (e.g., trash).
- `0.5 0.5` are the normalized coordinates of the bounding box center.
- `0.1 0.1` are the normalized width and height of the bounding box.

## Training the Model

To train the YOLOv5 model with the TACO dataset, follow these steps:

1. **Install Dependencies**:
   - Ensure you have Python and pip installed.
   - Install the required dependencies by running:
     ```bash
     pip install -r yolov5/requirements.txt
     ```

2. **Train the Model**:
   - Navigate to the YOLOv5 directory:
     ```bash
     cd yolov5
     ```
   - Run the training script with the appropriate configuration:
     ```bash
     python train.py --img 640 --batch 16 --epochs 100 --data data/waste.yaml --weights yolov5s.pt
     ```
   - This command will start training the YOLOv5 model with the TACO dataset, using images of size 640x640, a batch size of 16, and for 100 epochs.

## Inference

To run inference with the trained model:

1. **Run the Detection Script**:
   - Use the `detect.py` script to run inference on new images.
     ```bash
     python detect.py --weights runs/train/exp/weights/best.pt --img 640 --source ../TACO/test/images
     ```
   - Replace `runs/train/exp/weights/best.pt` with the path to your trained weights and `../TACO/test/images` with the path to the images you want to run inference on.

## Additional Information

- The `README.dataset.txt` and `README.roboflow.txt` files in the `Taco` directory contain additional information about the dataset and its source.
- The `README.md` in the `yolov5` directory provides detailed information about the YOLOv5 model and its usage.

By following these steps, you can effectively prepare your dataset, train the YOLOv5 model for trash detection, and run inference on new images.
