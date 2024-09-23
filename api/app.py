import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import pandas as pd
from wifi_heatmap.floorplan import FloorPlan
from flask import Flask, request, redirect, url_for, flash, jsonify
import os
import json
import base64
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 最大上傳檔案大小為16MB


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # 檢查是否有上傳的檔案
        data = request.json.get('image')
        objects = request.json.get('objects')
        if not data or not objects:
            return jsonify({"error": "Image data or objects missing"}), 400

        scale = request.json.get('scale', 100)
        signal_freq = request.json.get('signal_frequency', '2.4')

        print(request.json)

        header, base64_str = data.split(",", 1)

        image_data = base64.b64decode(base64_str)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_image.png')
        with open(file_path, 'wb') as f:
            f.write(image_data)

        routers = []
        for obj in objects:
            x = obj.get('x')
            y = obj.get('y')
            tx_power = obj.get('router').get('tx')
            routers.append({'x': x * 0.3, 'y': y * 0.3, 'tx_power': tx_power})
            # Do something with x and y, like logging or further processing
            print(f"Object found at x: {x}, y: {y}")

        # data = request.form.to_dict()
        # num_routers = len([key for key in data.keys() if key.startswith('router_x')])
        # routers = [(int(data.get(f'router_x[{i}]')), int(data.get(f'router_y[{i}]'))) for i in range(num_routers)]




        result = process_files(file_path, routers, scale, signal_freq, objects)

        # 刪除上傳的檔案
        # os.remove(file_path)

        return jsonify(result)

    return '''
    <!doctype html>
    <title>Floorplan API</title>
    <h1>Floorplan API</h1>
    '''

def process_files(file, routers, scale=100, signal_freq='2.4', objects=[]):
    IMAGE_FILE = file


    ## Scaling
    IMAGE_SCALING = 30  # Per-cent (%)
    SCALE = 1 / scale / IMAGE_SCALING  # Value in meter for each pixel

    ## TX Signal
    SIGNAL_FREQ_MAP = {'2.4': 2.4e9, '5': 5e9, '6': 6e9, '60': 60e9}
    SIGNAL_FREQ = SIGNAL_FREQ_MAP.get(signal_freq, 2.4e9)

    TX_POWER = 0  # dBm

    ## Model
    FREE_SPACE_PATH_LOSS_1M = 20 * np.log10(SIGNAL_FREQ) + 20 * np.log10((4.0 * np.pi) / 299792458)  # Aprox 40dB
    print(FREE_SPACE_PATH_LOSS_1M)
    # FREE_SPACE_PATH_LOSS_1M = 20 * np.log10(SIGNAL_FREQ) - 147.55  # Aprox 40dB

    PATH_LOSS_EXP = 2
    WALL_LOSS = 15  # dB
    # WALL_LOSS_THICK = 6.9 #dB

    ## Morphological Transformation
    # Use (2,2) for smaler images (< 200x200) and (4,4) for larger images
    KERNEL = (4, 4)

    # Plot constants
    ALPHA = 1.0

    floorplan = FloorPlan(IMAGE_FILE, scale=IMAGE_SCALING)
    # plt.imshow(floorplan.image)

    def convPixelToMeter(pix):
        return ((pix * SCALE) / (IMAGE_SCALING / 100.0))

    # Calculate distance between coordinates using pythagoras theorem
    def distance2d(src_x, src_y, dst_x, dst_y):
        dx = convPixelToMeter(dst_x - src_x)
        dy = convPixelToMeter(dst_y - src_y)
        return np.sqrt((dx ** 2) + (dy ** 2))

    def normalize_2d(matrix):
        return (matrix - np.min(matrix)) / (np.max(matrix) - np.min(matrix))

    def path_loss_multiwall(dist, wall_count, ref_loss=FREE_SPACE_PATH_LOSS_1M,
                        exponent=PATH_LOSS_EXP, wall_loss=WALL_LOSS):
        if dist == 0:
            return ref_loss
        return ref_loss + 10 * exponent * np.log10(dist) + wall_count * wall_loss

    def create_dataframe(origin_x, origin_y, tx_power):
        x_range = np.arange(floorplan.x_size)
        y_range = np.arange(floorplan.y_size)

        x_grid, y_grid = np.meshgrid(x_range, y_range)

        dist_grid = np.sqrt((convPixelToMeter(x_grid - origin_x)) ** 2 + (convPixelToMeter(y_grid - origin_y)) ** 2)
        wall_counts = np.array([[floorplan.countWalls(origin_x, origin_y, x, y) for x in x_range] for y in y_range])

        # Avoid division by zero
        dist_grid[dist_grid == 0] = np.nan

        loss_grid = np.array([path_loss_multiwall(d, w) for d, w in zip(dist_grid.flatten(), wall_counts.flatten())])
        loss_grid = loss_grid.reshape(dist_grid.shape)

        rssi_grid = tx_power - loss_grid

        wall_grid = np.array([[map[y, x] for x in x_range] for y in y_range])

        df = pd.DataFrame({
            'x': x_grid.flatten(),
            'y': y_grid.flatten(),
            'dist': dist_grid.flatten(),
            'loss': loss_grid.flatten(),
            'rssi': rssi_grid.flatten(),
            'walls': wall_grid.flatten()
        })

        return df

    map = floorplan.getWallMap(morph=True, kernel_size=KERNEL)
    # plt.imshow(map)
    # plt.savefig('uploads/map.png')

    dataframes = [create_dataframe(origin['x'], origin['y'], origin['tx_power']) for origin in routers]
    merged_df = pd.concat(dataframes)
    result_df = merged_df.groupby(['x', 'y'], as_index=False).agg({
        'dist': 'first',  # 可以選擇保留其他列的值，如果需要
        'loss': 'first',
        'rssi': 'max',
        'walls': 'first'
    })

    x_min, x_max = result_df['x'].min(), result_df['x'].max()
    y_min, y_max = result_df['y'].min(), result_df['y'].max()
    rssi_matrix = np.full((y_max - y_min + 1, x_max - x_min + 1), np.nan)

    for _, row in result_df.iterrows():
        rssi_matrix[int(row['y']) - y_min, int(row['x']) - x_min] = row['rssi']

    fig, ax = plt.subplots(figsize=(18, 12))  # 原始尺寸的 3 倍

    colors = ['#FFFFFF', '#FEFAFA', '#FBF3F4', '#FAECEC', '#E2898C', '#D98386', '#FACB7B', '#FCD679', '#FDDE77', '#FEE576', '#C1DF80', '#B2DA85', '#9ED38D', '#8ECD88']
    bounds = [-1000, -85, -83, -81, -79, -76, -75, -72, -70, -65, -62, -58, -52,-50, 0]
    cmap = mcolors.ListedColormap(colors)
    norm = mcolors.BoundaryNorm(bounds, cmap.N)
    # sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)

    # 绘制热图
    cax = ax.imshow(rssi_matrix, cmap=cmap, norm=norm, interpolation='nearest', aspect='equal')

    # 如果 walls 为 1，则用黑色显示墙壁区域
    walls_mask = result_df['walls'] == 1
    ax.scatter(result_df[walls_mask]['x'], result_df[walls_mask]['y'], color='black', marker='s')

    # print(df)
    # df.to_excel('output.xlsx', index=False)

    # 绘制蓝色的点
    x_coords = [item["x"] for item in routers]
    y_coords = [item["y"] for item in routers]
    ax.scatter(x_coords, y_coords, color='blue', marker='o', s=100)  # s=100 是点的大小

    # 添加颜色条
    # cbar = fig.colorbar(cax, ax=ax, label='RSSI')
    # ticks = np.arange(-1000, 1, 5)  # 每隔 5 顯示一個刻度
    # cbar.set_ticks(ticks)
    # cbar.set_ticklabels([f'{tick}' for tick in ticks])

    # 翻转 y 轴
    # plt.gca().invert_yaxis()

    plt.grid(False)

    # 隐藏 x 轴和 y 轴的刻度数字
    plt.xticks([])
    plt.yticks([])

    # 移除坐标轴和留白
    plt.axis('off')

    # 调整布局以去掉留白
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    # 显示图表
    # plt.xlabel('x')
    # plt.ylabel('y')
    # plt.title('RSSI Heatmap with Walls')
    # plt.show()

    # 轉成 base64
    buf = BytesIO()
    fig.savefig(buf, bbox_inches='tight', pad_inches=0, format='png')
    buf.seek(0)

    # 将字节对象编码为 Base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    # 生成 data:image URL
    img_data = f'data:image/png;base64,{img_base64}'

    # result_image_data = base64.b64decode(img_base64)
    # result_file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'result.png')
    # with open(result_file_path, 'wb') as f:
    #     f.write(result_image_data)


    result = {
        "status": 'ok',
        "heatmap": img_data,
        "frequency": signal_freq,
        "routers": objects
    }
    return result


if __name__ == '__main__':
    # 確保上傳資料夾存在
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    PORT = os.environ.get('PORT', 80)

    app.run(host='0.0.0.0', port=PORT)
