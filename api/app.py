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
            routers.append({'x': x * 0.3, 'y': y * 0.3})
            # Do something with x and y, like logging or further processing
            print(f"Object found at x: {x}, y: {y}")

        # data = request.form.to_dict()
        # num_routers = len([key for key in data.keys() if key.startswith('router_x')])
        # routers = [(int(data.get(f'router_x[{i}]')), int(data.get(f'router_y[{i}]'))) for i in range(num_routers)]




        result = process_files(file_path, routers, scale, signal_freq)

        # 刪除上傳的檔案
        # os.remove(file_path)

        return jsonify(result)

    return '''
    <!doctype html>
    <title>Floorplan API</title>
    <h1>Floorplan API</h1>
    '''

def process_files(file, routers, scale=100, signal_freq='2.4'):
    IMAGE_FILE = file

    MODEL = 'MULTIWALL'
    # MODEL = 'ONE_SLOPE'

    ## Scaling
    IMAGE_SCALING = 30  # Per-cent (%)
    SCALE = 1 / scale / IMAGE_SCALING  # Value in meter for each pixel

    ## TX Signal
    SIGNAL_FREQ = 2.4e9

    if signal_freq=='2.4':
        SIGNAL_FREQ = 2.4e9
    elif signal_freq=='5':
        SIGNAL_FREQ = 5e9
    elif signal_freq=='6':
        SIGNAL_FREQ = 6e9
    elif signal_freq=='60':
        SIGNAL_FREQ = 60e9

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

    def path_loss_one_slope(src_x, src_y, dst_x, dst_y, ref_loss=FREE_SPACE_PATH_LOSS_1M, exponent=PATH_LOSS_EXP):
        dist = distance2d(src_x, src_y, dst_x, dst_y)
        return (ref_loss + 10 * exponent * np.log10(dist)) if dist > 1 else ref_loss

    def path_loss_multiwall(src_x, src_y, dst_x, dst_y, wall_count, ref_loss=FREE_SPACE_PATH_LOSS_1M,
                            exponent=PATH_LOSS_EXP, wall_loss=WALL_LOSS):
        dist = distance2d(src_x, src_y, dst_x, dst_y)
        if dist == 0:
            return ref_loss
        total_loss = ref_loss + 10 * exponent * np.log10(dist) + wall_count * wall_loss
        return total_loss

    def calc_loss(model, *argv):
        if model == 'ONE_SLOPE':
            return path_loss_one_slope(*argv)
        elif model == 'MULTIWALL':
            return path_loss_multiwall(*argv)

    def create_dataframe(origin_x, origin_y):
        x_list = []
        y_list = []
        dist_list = []
        loss_list = []
        rssi_list = []
        wall_list = []

        for x in range(floorplan.x_size):
            for y in range(floorplan.y_size):
                loss = calc_loss(MODEL, origin_x, origin_y, x, y, floorplan.countWalls(origin_x, origin_y, x, y))
                rssi = TX_POWER - loss
                dist_list.append(distance2d(origin_x, origin_y, x, y))
                loss_list.append(loss)
                rssi_list.append(rssi)
                x_list.append(x)
                y_list.append(y)
                wall_list.append(map[y][x])

        return pd.DataFrame(
            {'x': x_list, 'y': y_list, 'dist': dist_list, 'loss': loss_list, 'rssi': rssi_list, 'walls': wall_list})

    map = floorplan.getWallMap(morph=True, kernel=KERNEL)
    # plt.imshow(map)
    # plt.savefig('uploads/map.png')

    origins = routers
    dataframes = [create_dataframe(origin['x'], origin['y']) for origin in origins]

    merged_df = pd.concat(dataframes)
    result_df = merged_df.groupby(['x', 'y'], as_index=False).agg({
        'dist': 'first',  # 可以選擇保留其他列的值，如果需要
        'loss': 'first',
        'rssi': 'max',
        'walls': 'first'
    })

    df = result_df

    x_min, x_max = df['x'].min(), df['x'].max()
    y_min, y_max = df['y'].min(), df['y'].max()
    rssi_matrix = np.full((y_max - y_min + 1, x_max - x_min + 1), np.nan)

    for _, row in df.iterrows():
        rssi_matrix[int(row['y']) - y_min, int(row['x']) - x_min] = row['rssi']

    fig, ax = plt.subplots(figsize=(18, 12))  # 原始尺寸的 3 倍

    colors = ['#FFFFFF', '#FEFAFA', '#FBF3F4', '#FAECEC', '#E2898C', '#D98386', '#FACB7B', '#FCD679', '#FDDE77', '#FEE576', '#C1DF80', '#B2DA85', '#9ED38D', '#8ECD88']
    bounds = [-1000, -85, -83, -81, -79, -76, -75, -72, -70, -65, -62, -58, -52,-50, 0]
    cmap = plt.cm.colors.ListedColormap(colors)
    norm = mcolors.BoundaryNorm(bounds, cmap.N)
    sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)

    # 绘制热图
    cax = ax.imshow(rssi_matrix, cmap=cmap, norm=norm, interpolation='nearest', aspect='equal')

    # 如果 walls 为 1，则用黑色显示墙壁区域
    walls_mask = df['walls'] == 1
    ax.scatter(df[walls_mask]['x'], df[walls_mask]['y'], color='black', marker='s')

    # print(df)
    # df.to_excel('output.xlsx', index=False)

    # 绘制蓝色的点
    x_coords = [item["x"] for item in origins]
    y_coords = [item["y"] for item in origins]
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
    result_image_data = base64.b64decode(img_base64)
    result_file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'result.png')
    with open(result_file_path, 'wb') as f:
        f.write(result_image_data)


    result = {
        "status": 'ok',
        "heatmap": img_data
    }
    return result


if __name__ == '__main__':
    # 確保上傳資料夾存在
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    PORT = os.environ.get('PORT', 80)

    app.run(host='0.0.0.0', port=PORT)
