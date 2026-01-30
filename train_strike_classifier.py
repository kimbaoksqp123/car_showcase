import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from pathlib import Path
import pickle

class StrikeThroughClassifier:
    def __init__(self):
        # Sử dụng SVM của OpenCV
        self.model = cv2.ml.SVM_create()
        self.model.setType(cv2.ml.SVM_C_SVC)
        self.model.setKernel(cv2.ml.SVM_RBF)
        self.model.setTermCriteria((cv2.TERM_CRITERIA_MAX_ITER, 100, 1e-6))

    def extract_features(self, image):
        """Trích xuất đặc trưng từ ảnh"""
        # Chuyển sang ảnh xám
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # 1. HOG Features
        hog = cv2.HOGDescriptor()
        h = hog.compute(cv2.resize(gray, (64, 64)))

        # 2. Line features using Hough Transform
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLines(edges, 1, np.pi/180, 30)
        line_features = np.zeros(18)  # 9 góc * 2 (rho dương/âm)
        
        if lines is not None:
            for rho, theta in lines[:, 0]:
                angle_bin = int(theta * 180 / np.pi / 20)  # Chia góc thành 9 khoảng
                if rho >= 0:
                    line_features[angle_bin] += 1
                else:
                    line_features[angle_bin + 9] += 1

        # 3. Contour features
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contour_features = np.zeros(5)
        for cnt in contours:
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, True)
            if perimeter > 0:
                circularity = 4 * np.pi * area / (perimeter * perimeter)
                contour_features[0] += area
                contour_features[1] += perimeter
                contour_features[2] += circularity
                contour_features[3] += len(cnt)
                contour_features[4] += area / perimeter

        # Kết hợp tất cả đặc trưng
        features = np.concatenate([h.flatten(), line_features, contour_features])
        return features

    def prepare_dataset(self, data_dir):
        """Chuẩn bị dataset từ thư mục chứa ảnh"""
        features = []
        labels = []
        data_path = Path(data_dir)

        # Đọc ảnh từ thư mục normal (label 0)
        normal_path = data_path / 'normal'
        for img_path in normal_path.glob('*.jpg'):
            img = cv2.imread(str(img_path))
            if img is not None:
                features.append(self.extract_features(img))
                labels.append(0)

        # Đọc ảnh từ thư mục strike_through (label 1)
        strike_path = data_path / 'strike_through'
        for img_path in strike_path.glob('*.jpg'):
            img = cv2.imread(str(img_path))
            if img is not None:
                features.append(self.extract_features(img))
                labels.append(1)

        return np.array(features), np.array(labels)

    def train(self, data_dir):
        """Training mô hình"""
        # Chuẩn bị dataset
        X, y = self.prepare_dataset(data_dir)
        
        # Chia dataset thành training và testing
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Training
        self.model.train(X_train.astype(np.float32), cv2.ml.ROW_SAMPLE, 
                        y_train.astype(np.int32))

        # Đánh giá mô hình
        _, y_pred = self.model.predict(X_test.astype(np.float32))
        accuracy = np.mean(y_pred == y_test)
        print(f"Accuracy on test set: {accuracy:.2f}")

        return accuracy

    def save_model(self, path):
        """Lưu mô hình"""
        self.model.save(path)

    def load_model(self, path):
        """Tải mô hình"""
        self.model = cv2.ml.SVM_load(path)

    def predict(self, image):
        """Dự đoán cho một ảnh mới"""
        features = self.extract_features(image)
        _, prediction = self.model.predict(features.reshape(1, -1).astype(np.float32))
        return prediction[0][0]

def prepare_image_for_training(image):
    """Chuẩn bị ảnh cho training"""
    # Resize ảnh về kích thước chuẩn
    resized = cv2.resize(image, (64, 64))
    
    # Chuẩn hóa độ sáng và độ tương phản
    lab = cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    normalized = cv2.merge((cl,a,b))
    normalized = cv2.cvtColor(normalized, cv2.COLOR_LAB2BGR)
    
    return normalized

def main():
    # Khởi tạo classifier
    classifier = StrikeThroughClassifier()

    # Training
    print("Starting training...")
    data_dir = "dataset"  # Thư mục chứa data training
    accuracy = classifier.train(data_dir)
    
    # Lưu mô hình
    classifier.save_model("strike_through_model.yml")
    print(f"Model saved with accuracy: {accuracy}")

    # Test với ảnh mới
    test_image = cv2.imread("test_image.jpg")
    if test_image is not None:
        # Chuẩn bị ảnh
        prepared_image = prepare_image_for_training(test_image)
        
        # Dự đoán
        prediction = classifier.predict(prepared_image)
        result = "Strike-through" if prediction == 1 else "Normal"
        print(f"Prediction for test image: {result}")

if __name__ == "__main__":
    main() 