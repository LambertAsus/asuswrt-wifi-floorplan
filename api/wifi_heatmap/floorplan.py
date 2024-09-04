import cv2
import numpy as np
from skimage.draw import line

class FloorPlan:
    
    def __init__(self, path='', scale=100):
        self.image_path = path
        self.image = None
        self.x_size = 0
        self.y_size = 0
        self.scale = scale
        self.accessPoints = []
        if path:
            self.loadFromFile(path, scale)

    def rescaleImg(self, scale):
        if scale == 100:
            return
        height, width = self.image.shape[:2]
        dim = (int(width * scale / 100), int(height * scale / 100))
        self.image = cv2.resize(self.image, dim, interpolation=cv2.INTER_AREA)
        self.y_size, self.x_size = self.image.shape[:2]

    def loadFromFile(self, image_path, scale=100):
        self.image_path = image_path
        self.image = cv2.imread(image_path)
        if self.image is not None:
            self.rescaleImg(scale)

    def loadFromArray(self, data: np.ndarray, scale=100):
        self.image = data
        self.y_size, self.x_size = self.image.shape[:2]
        self.rescaleImg(scale)

    def getWallMap(self, morph=True, kernel_size=(5, 5)):
        self.removeAccessPoints()
        gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        _, im_bw = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

        if morph:
            kernel = np.ones(kernel_size, np.uint8)
            morph_img = cv2.morphologyEx(im_bw, cv2.MORPH_CLOSE, kernel)
        else:
            morph_img = im_bw

        wallmap = np.invert(morph_img) / 255
        self.wallmap = wallmap
        return wallmap

    def countWalls(self, src_x, src_y, dst_x, dst_y, debug=False):
        line_r, line_c = line(int(src_y), int(src_x), int(dst_y), int(dst_x))
        if len(line_r) == 0 or len(line_c) == 0:
            return 0

        wall_points = self.wallmap[line_r, line_c]
        kernel = np.array([1, -1])
        walls = np.sum(np.convolve(wall_points.astype(int), kernel, mode='valid') > 0)

        if debug:
            print(f'Total walls: {walls}')

        return walls

    def findAccessPoints(self, color='blue'):
        lower_blue = np.array([101, 50, 38])
        upper_blue = np.array([130, 255, 255])

        hsv = cv2.cvtColor(self.image, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        self.accessPoints = []
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            M = cv2.moments(contour)
            if M['m00'] != 0:
                cx = int(M['m10'] / M['m00'])
                cy = int(M['m01'] / M['m00'])
                self.accessPoints.append((cx, cy, x, y, w, h))

        return self.accessPoints

    def removeAccessPoints(self):
        if not self.accessPoints:
            self.findAccessPoints()
            for _, _, x, y, w, h in self.accessPoints:
                cv2.rectangle(self.image, (x, y), (x + w, y + h), (255, 255, 255), -1)
