import os
import torch
from models.waste.yolov5.utils.general import non_max_suppression, scale_boxes  # Import scale_boxes from general.py
from models.waste.yolov5.utils.plots import plot_one_box
from models.waste.yolov5.utils.dataloaders import LoadImages
from models.waste.yolov5.models.common import DetectMultiBackend
from models.waste.yolov5.utils.torch_utils import select_device

# Load model
weights = 'models/waste/yolov5/yolov5s.pt'  # Path to the model weights
device = select_device('')  # Automatically selects the best available device (GPU/CPU)
model = DetectMultiBackend(weights, device=device)
stride, names, pt = model.stride, model.names, model.pt
img_size = 640  # Image size (height, width)
half = device.type != 'cpu'  # Use half precision only if GPU is available

if half:
    model.model.half()  # Convert model to half precision

# Function to detect trash
def detect_trash(filepath):
    dataset = LoadImages(filepath, img_size=img_size, stride=stride, auto=pt)
    results = []
    model.eval()

    for path, img, im0s, vid_cap, s in dataset:
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()
        img /= 255.0  # Normalize to [0, 1]

        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        pred = model(img)
        pred = non_max_suppression(pred, 0.25, 0.45, None, False, max_det=1000)

        for i, det in enumerate(pred):
            if len(det):
                det[:, :4] = scale_boxes(img.shape[2:], det[:, :4], im0s.shape).round()

                for *xyxy, conf, cls in reversed(det):
                    label = f'{names[int(cls)]} {conf:.2f}'
                    plot_one_box(xyxy, im0s, label=label, color=(255, 0, 0), line_thickness=2)
                    results.append({
                        'class': names[int(cls)],
                        'confidence': conf.item(),
                        'bbox': [x.item() for x in xyxy]
                    })

    return results

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python detect_trash.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist.")
        sys.exit(1)

    detections = detect_trash(image_path)
    print(detections)
