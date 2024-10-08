import {Tooltip} from 'bootstrap';
import * as THREE from 'three';
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";

const config = {
    scale: 1,
    signal_frequency: '2.4',
};

const routerList = [
    {
        name: 'RT-BE92U',
        img: 'img/RT-BE92U.png',
        tx: 0,
        range: '25 m²',
        wifi_version: 'WiFi7',
    },
    {
        name: 'BM68',
        img: 'img/ExpertWiFi_BM68.png',
        tx: 10,
        range: '50 m²',
        wifi_version: 'WiFi6',
    }
];

const resultViewDiv = document.getElementById('resultView');

const routerDiv = document.getElementById('routers');
routerList.forEach(router => {
    const li = document.createElement('li');
    li.classList = 'd-flex justify-content-between align-items-start list-group-item list-group-item-action';
    li.setAttribute('data-router-name', router.name);
    li.innerHTML = `<div class="me-auto d-flex align-items-center gap-1">
                        <img src="${router.img}" alt="${router.name}" width="30">
                        <div>
                            <div class="fw-bold">${router.name}</div>
                            <small>${router.range}</small>
                        </div>
                    </div>
                    <span class="badge bg-secondary rounded-pill">${router.wifi_version}</span>`;
    routerDiv.appendChild(li);
});

const resultCardsClickEvent = (e) => {
    e.preventDefault();

    const targetElement = e.currentTarget;
    const meshId = targetElement.dataset.meshId;
    if (targetElement.classList.contains('active')) {
        targetElement.classList.remove('active');
        const hoverView = targetElement.querySelector('.hover-veiw i');
        hoverView.classList.add('bi-eye-fill');
        hoverView.classList.remove('bi-eye-slash-fill');
        resultViewMeshs.forEach(mesh => {
            scene.remove(mesh);
        });
    } else {
        resultCards.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
            const hoverView = card.querySelector('.hover-veiw i');
            hoverView.classList.add('bi-eye-fill');
            hoverView.classList.remove('bi-eye-slash-fill');
        });
        targetElement.classList.add('active');
        const hoverView = targetElement.querySelector('.hover-veiw i');
        hoverView.classList.remove('bi-eye-fill');
        hoverView.classList.add('bi-eye-slash-fill');
        resultViewMeshs.forEach(mesh => {
            if (mesh.uuid === meshId) {
                scene.add(mesh);

                circles.forEach(router => {
                    scene.remove(router);
                });
                circles.length = 0;
                mesh.routers.forEach(router => {
                    createRouterMesh(router.router.name, router.editor_x, router.editor_y);
                })
            } else {
                scene.remove(mesh);
            }
        });
    }
}

const resultCards = document.getElementById('resultCards');
resultCards.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', resultCardsClickEvent);
});

const offcanvasScrolling = document.getElementById('offcanvasScrolling')
offcanvasScrolling.addEventListener('hidden.bs.offcanvas', function () {
    routerDiv.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
    });
})


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

const wallDiv = document.getElementById('wall');
const eraserDiv = document.getElementById('eraser');

const sendButton = document.getElementById('sendButton');

const frequencyButtons = document.querySelectorAll('input[name="freq"]');

frequencyButtons.forEach(button => {
    button.addEventListener('change', () => {
        const activeFrequency = document.querySelector('input[name="freq"]:checked').value;
        config.signal_frequency = activeFrequency;
        console.log('Active Frequency:', activeFrequency);
    });
});


const scaleDiv = document.getElementById('scale');
const scalePanel = document.getElementById('scalePanel');
const scaleInput = document.getElementById('scaleInput');
const scaleRedrawButton = document.getElementById('scaleRedrawButton');
const scaleSaveButton = document.getElementById('scaleSaveButton');
const scaleEditButton = document.getElementById('scaleEditButton');
scaleEditButton.querySelector('span').innerText = `1m : 100px`;
scaleRedrawButton.addEventListener('click', (e) => {
    e.preventDefault();
    scalePanel.style.display = 'none';
    isDrawing = false;
    scaleStartPoint = null;
    scaleLine = null;
    scaleLines.forEach(line => scene.remove(line));
    config.scale = parseFloat(scaleInput.value);
    console.log('config.scale', config.scale)
});
scaleInput.addEventListener('input', (e) => {
    let value = e.target.value;
    let validValue = value.match(/^\d*\.?\d{0,2}/);
    e.target.value = validValue ? validValue[0] : '';
    if (e.target.value.trim() !== '') {
        scaleSaveButton.classList.remove('disabled');
    } else {
        scaleSaveButton.classList.add('disabled');
    }
});
scaleSaveButton.addEventListener('click', (e) => {
    e.preventDefault();
    scalePanel.style.display = 'none';
    isDrawing = false;
    scaleStartPoint = null;
    scaleLine = null;
    scaleLines.forEach(line => {
        const positions = line.geometry.attributes.instanceStart.array;
        const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const end = new THREE.Vector3(positions[positions.length - 3], positions[positions.length - 2], positions[positions.length - 1]);
        const lineLength = start.distanceTo(end);
        const scaleInputValue = parseFloat(scaleInput.value);
        const scale = (lineLength / scaleInputValue).toFixed(2);
        scene.remove(line)
        scaleEditButton.querySelector('span').innerText = `1m : ${scale}px`;
        config.scale = parseFloat(scale);
        console.log('config.scale', config.scale)
    });
    scaleLines.length = 0;
});
scaleEditButton.addEventListener('click', (e) => {
    scaleDiv.classList.add('active');
});

routerDiv.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', function (e) {
        e.preventDefault();

        const targetElement = e.currentTarget;
        if (targetElement.classList.contains('active')) {
            targetElement.classList.remove('active');
        } else {
            routerDiv.querySelectorAll('li').forEach(li => {
                li.classList.remove('active');
            });
            targetElement.classList.add('active');
        }
    });
});

document.querySelectorAll('.nav-link').forEach(nav => {
    nav.addEventListener('click', function (e) {
        e.preventDefault();

        const targetElement = e.currentTarget;
        if (targetElement.classList.contains('active')) {
            targetElement.classList.remove('active');
        } else {
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove('active');
            });
            targetElement.classList.add('active');
        }
    });
});

class popup {
    constructor(props) {
        this.popup = document.createElement('div');
        this.popup.classList.add('popup_bg');
        this.popup.style.display = 'none';
        const content = props.content || '';
        this.popup.innerHTML = `<div class="loader">${content}</div>`
        document.body.appendChild(this.popup);
    }

    show() {
        this.popup.style.display = 'block';
    }

    hide() {
        this.popup.style.display = 'none';
    }
}

const loader = new popup({
    content: `
                    <div class="loader">
                        <div class="spinner-border text-info" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>`
});

const selectBackground = new popup(
    {
        content: `
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <label class="btn btn-outline-primary">
                                    <input id="fileInput" style="display:none;" type="file">
                                    <i class="bi bi-grid-1x2-fill"></i>
                                    <i class="fa fa-photo"></i> Upload Floor Plan Image
                                </label>
                            </div>
                        </div>
                    </div>`
    });

selectBackground.show();

document.getElementById('logo').addEventListener('click', () => {
    selectBackground.show();
});


const canvas = document.getElementById('myCanvas');

// 基本場景設定
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    0.1, 10000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf7f7f7, 1);

// 建立一個平面的背景 (平面繪圖板)
const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();
let backgroundMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xf7f7f7}));
const resultViewMeshs = [];
let overlayMesh;
scene.add(backgroundMesh);

// 圓形物件列表
const circles = [];

// 處理圖片上傳
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    textureLoader.load(url, function (texture) {
        selectBackground.hide();
        const imageAspect = texture.image.width / texture.image.height;
        const canvasAspect = window.innerWidth / window.innerHeight;
        let planeWidth, planeHeight;

        // 缩放因子
        const scaleFactor = 0.8;

        if (imageAspect > canvasAspect) {
            // 如果图像比画布宽（保持宽度一致）
            planeWidth = window.innerWidth * scaleFactor;
            planeHeight = (window.innerWidth / imageAspect) * scaleFactor;
        } else {
            // 如果图像比画布高（保持高度一致）
            planeHeight = window.innerHeight * scaleFactor;
            planeWidth = (window.innerHeight * imageAspect) * scaleFactor;
        }

        // 删除之前的背景
        if (backgroundMesh) {
            scene.remove(backgroundMesh);
        }
        if (overlayMesh) {
            scene.remove(overlayMesh);
        }

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({map: texture});
        backgroundMesh = new THREE.Mesh(geometry, material);
        backgroundMesh.position.set(0, 0, 0); // 确保在屏幕中央
        backgroundMesh.imgWidth = texture.image.width;
        backgroundMesh.imgHeight = texture.image.height;

        scene.add(backgroundMesh);
    });
});

const circleZ = 15;

const lineWidth = 15;
let mouseDown = false;
let selectedCircle = null;
let hoveredCircle = null;
let startPoint = null;
let selectedLine = null;
let startCircle = null;
let endCircle = null;
let hoveredLineEndpoints = [];
let hoveredLine = null;
let selectedEndpoint = null;
let isDrawing = false;
let drawingLine = null;
const lines = [];

// scale
let scaleLine = null;
const scaleLines = [];
let scaleStartPoint = null;

const erasers = [];
let erasing = false;

function checkRouterExist() {
    if (circles.length === 0) {
        sendButton.classList.add('disabled');
    } else {
        sendButton.classList.remove('disabled');
    }
}

function removeLineEndpoint() {
    for (const circle of hoveredLineEndpoints) {
        scene.remove(circle);
    }
    hoveredLineEndpoints = [];
}

function createLineEndpoint(start, end) {
    const circleGeometry = new THREE.CircleGeometry(3, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const startCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    const startCirclePosition = new THREE.Vector3(start.x, start.y, 5);
    startCircle.position.copy(startCirclePosition);
    hoveredLineEndpoints.push(startCircle);
    scene.add(startCircle);

    const endCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    const endCirclePosition = new THREE.Vector3(end.x, end.y, 5);
    endCircle.position.copy(endCirclePosition);
    hoveredLineEndpoints.push(endCircle);
    scene.add(endCircle);
}

const createRouterMesh = (name, x, y) => {

        const router = routerList.find(router => router.name === name);

        const hoverCircleGeometry = new THREE.CircleGeometry(22, 32);
        const hoverCircleMaterial = new THREE.MeshBasicMaterial({color: 0x6ea8fe});
        const hoverCircle = new THREE.Mesh(hoverCircleGeometry, hoverCircleMaterial);

        const outerCircleGeometry = new THREE.CircleGeometry(20, 32);
        const outerCircleMaterial = new THREE.MeshBasicMaterial({color: 0x808080});
        const outerCircle = new THREE.Mesh(outerCircleGeometry, outerCircleMaterial);

        const circleGeometry = new THREE.CircleGeometry(18, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.add(hoverCircle);
        circle.add(outerCircle);

        // 載入SVG圖片
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(router.img, function (texture) {
            const svgMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true});
            const svgGeometry = new THREE.PlaneGeometry(20, 20); // 可以調整尺寸
            const svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);
            svgMesh.position.set(0, 0, 0.1); // 略微前移以避免與圓形重疊
            circle.add(svgMesh);
        });

        circle.position.set(
            x, y,
            circleZ
        );

        circle.router = router;

        circles.push(circle);
        scene.add(circle);
}

function onDocumentMouseDown(event) {
    mouseDown = true;

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const point = new THREE.Vector3(
        (event.clientX - window.innerWidth / 2) / camera.zoom,
        -(event.clientY - window.innerHeight / 2) / camera.zoom,
        0
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(circles);
    if (intersects.length > 0) {
        // 如果点击到了圆形，选择该圆形
        selectedCircle = intersects[0].object;
    } else if (routerDiv.querySelector('li.active')) {
        const selectedRouterName = routerDiv.querySelector('li.active').getAttribute('data-router-name');
        createRouterMesh(selectedRouterName, point.x, point.y);
    } else {

        // 如果繪製牆壁啟用
        if (wallDiv.classList.contains('active')) {
            if (!isDrawing && !startPoint) {
                isDrawing = true;
                startPoint = point;
                const lineGeometry = new LineGeometry();
                lineGeometry.setPositions([startPoint.x, startPoint.y, 1, startPoint.x, startPoint.y, 1]);
                const lineMaterial = new LineMaterial({
                    color: 0x000000,
                    linewidth: lineWidth,
                    dashed: false,
                    opacity: 1.0,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
                });
                drawingLine = new Line2(lineGeometry, lineMaterial);
                scene.add(drawingLine);
                lines.push(drawingLine);
            } else {
                // 第二次点击，完成绘制
                startPoint = null;
                drawingLine = null;
                isDrawing = false;
                selectedLine = null;
            }
        } else if (scaleDiv.classList.contains('active')) {
            if (!isDrawing && !scaleStartPoint) {
                isDrawing = true;
                scaleStartPoint = point;
                const lineGeometry = new LineGeometry();
                lineGeometry.setPositions([scaleStartPoint.x, scaleStartPoint.y, 1, scaleStartPoint.x, scaleStartPoint.y, 1]);
                const lineMaterial = new LineMaterial({
                    color: 0x000077,
                    linewidth: lineWidth,
                    dashed: false,
                    opacity: 1.0,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
                });
                scaleLine = new Line2(lineGeometry, lineMaterial);
                scene.add(scaleLine);
                scaleLines.push(scaleLine);
            } else {
                // 第二次点击，完成绘制
                if (scalePanel.style.display !== 'block') {
                    const scalePanelWidth = parseFloat(scalePanel.style.width);
                    const scalePanelHeight = parseFloat(scalePanel.style.height);
                    let scalePanelPositionX = `${event.clientX + 20}px`;
                    let scalePanelPositionY = `${event.clientY}px`;
                    if (event.clientX + 20 + scalePanelWidth > window.innerWidth) {
                        scalePanelPositionX = `${event.clientX - 20 - scalePanelWidth}px`;
                    }
                    if (event.clientY + 20 + scalePanelHeight > window.innerHeight) {
                        scalePanelPositionY = `${event.clientY - 20 - scalePanelHeight}px`;
                    }
                    scaleStartPoint = null;
                    scaleLine = null;
                    // isDrawing = false;
                    // selectedLine = null;
                    scalePanel.style.display = 'block';
                    scalePanel.style.left = scalePanelPositionX;
                    scalePanel.style.top = scalePanelPositionY;
                }
            }
        } else if (eraserDiv.classList.contains('active')) {
            erasing = true;
        } else {

            // 清除選擇的線條
            selectedLine = null;
            for (const line of lines) {
                line.material.color.set(0x000000);
            }

            // 選擇線條
            for (const line of lines) {
                const positions = line.geometry.attributes.instanceStart.array;
                const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
                const end = new THREE.Vector3(positions[positions.length - 3], positions[positions.length - 2], positions[positions.length - 1]);
                const distToLine = new THREE.Line3(start, end).closestPointToPoint(point, true, new THREE.Vector3()).distanceTo(point);

                if (distToLine < lineWidth) {
                    selectedLine = line;
                    selectedLine.material.color.set(0x00ff00);
                    selectedEndpoint = null;
                    if (point.distanceTo(start) < lineWidth) {
                        selectedEndpoint = "start";
                    } else if (point.distanceTo(end) < lineWidth) {
                        selectedEndpoint = "end";
                    }
                    console.log(selectedEndpoint)
                    break
                }
            }

            //
            // if (!selectedLine) {
            //     for (const line of lines) {
            //         line.material.color.set(0x000000);
            //     }
            // }
        }
    }
    checkRouterExist();
}

function updateHover(point, cursorStyle = 'auto') {
    let newHoveredLine = null;


    for (const line of lines) {
        const positions = line.geometry.attributes.instanceStart.array;
        const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const end = new THREE.Vector3(positions[positions.length - 3], positions[positions.length - 2], positions[positions.length - 1]);
        const distToLine = new THREE.Line3(start, end).closestPointToPoint(point, true, new THREE.Vector3()).distanceTo(point);

        if (distToLine < 10) {
            cursorStyle = 'pointer';
            newHoveredLine = line;
            break;
        }
    }

    // If hovering a different line, update the color and circles
    if (newHoveredLine !== hoveredLine) {
        // Reset the previous hovered line
        if (hoveredLine) {
            if (!selectedLine) {
                hoveredLine.material.color.set(hoveredLine.originalColor);
            }
            removeLineEndpoint();
        }

        // Set the new hovered line
        if (newHoveredLine) {
            if (!selectedLine) {
                newHoveredLine.originalColor = newHoveredLine.material.color.getHex(); // Save original color
                newHoveredLine.material.color.set(0xff0000); // Change to red
            }
            const positions = newHoveredLine.geometry.attributes.instanceStart.array;
            const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
            const end = new THREE.Vector3(positions[positions.length - 3], positions[positions.length - 2], positions[positions.length - 1]);
            if (!endCircle && !startPoint) {
                createLineEndpoint(start, end);
            }
        }

        hoveredLine = newHoveredLine;
    }

    if (wallDiv.classList.contains('active') || (scaleDiv.classList.contains('active') && scalePanel.style.display !== 'block')) {
        cursorStyle = 'crosshair';
    }

    canvas.style.cursor = cursorStyle;
}

function onDocumentMouseMove(event) {


    // console.log('selectedLine', selectedLine)
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const point = new THREE.Vector3(
        (event.clientX - window.innerWidth / 2) / camera.zoom,
        -(event.clientY - window.innerHeight / 2) / camera.zoom,
        0
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const circlesIntersects = raycaster.intersectObjects(circles);
    if (circlesIntersects.length > 0) {
        const intersectedCircle = circlesIntersects[0].object;

        if (hoveredCircle !== intersectedCircle) {
            if (hoveredCircle) {
                // 隐藏之前悬停的圆形的外框
                hoveredCircle.children[0].visible = false;
            }
            // 显示当前悬停的圆形的外框
            intersectedCircle.children[0].visible = true;
            hoveredCircle = intersectedCircle;
        }

        // 更改鼠标光标为 pointer
        document.body.style.cursor = 'pointer';
    } else {
        if (hoveredCircle) {
            // 隐藏外框
            hoveredCircle.children[0].visible = false;
            hoveredCircle = null;
        }

        // 恢复鼠标光标为默认
        document.body.style.cursor = 'default';
    }

    if (selectedCircle) {
        // 移动已选中的圆形
        selectedCircle.position.set(
            (event.clientX - window.innerWidth / 2) / camera.zoom,
            -(event.clientY - window.innerHeight / 2) / camera.zoom,
            circleZ
        );
    }

    updateHover(point);

    if (wallDiv.classList.contains('active')) {
        if (isDrawing && startPoint && drawingLine) {
            drawingLine.geometry.setPositions([startPoint.x, startPoint.y, 0, point.x, point.y, 0]);
            drawingLine.computeLineDistances();
        }
    } else if (scaleDiv.classList.contains('active')) {
        if (isDrawing && scaleStartPoint && scaleLine) {
            scaleLine.geometry.setPositions([scaleStartPoint.x, scaleStartPoint.y, 0, point.x, point.y, 0]);
            scaleLine.computeLineDistances();
        }
    } else if (eraserDiv.classList.contains('active')) {
        if (erasing) {
            const eraserGeometry = new THREE.CircleGeometry(10, 32);
            const eraserMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            const eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);
            eraser.position.set(
                (event.clientX - window.innerWidth / 2) / camera.zoom,
                -(event.clientY - window.innerHeight / 2) / camera.zoom,
                0
            );
            erasers.push(eraser);
            scene.add(eraser);
        }
    } else {
        if (selectedLine && mouseDown) {
            canvas.style.cursor = 'grabbing';
            const positions = selectedLine.geometry.attributes.instanceStart.array;
            console.log(selectedEndpoint)
            if (selectedEndpoint === "start") {
                selectedLine.geometry.setPositions([point.x, point.y, 0, positions[3], positions[4], 0]);
            } else if (selectedEndpoint === "end") {
                selectedLine.geometry.setPositions([positions[0], positions[1], 0, point.x, point.y, 0]);
            }
            selectedLine.computeLineDistances();
        }
    }
}

function onDocumentMouseUp() {
    // 釋放選中的圓形
    selectedCircle = null;
    selectedEndpoint = null;
    mouseDown = false;
    erasing = false;
}

function onWindowResize() {
    // 更新 canvas 尺寸
    const canvas = renderer.domElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 更新渲染器的大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 更新相机的投影矩阵
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
}

function onDocumentRightClick(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(circles);

    if (intersects.length > 0) {
        // 刪除選中的圓形
        const circleToDelete = intersects[0].object;
        scene.remove(circleToDelete);

        const index = circles.indexOf(circleToDelete);
        if (index > -1) {
            circles.splice(index, 1);
        }
    }
    checkRouterExist();
}

function onKeyDown(event) {
    if (event.key === "Escape") { // Check if the ESC key was pressed
        console.log("ESC key pressed");
        if (isDrawing && startPoint) {
            isDrawing = false;
            startPoint = null;
            if (drawingLine) {
                scene.remove(drawingLine);
            }
        } else if (isDrawing && scaleStartPoint) {
            isDrawing = false;
            scaleStartPoint = null;
            if (scaleLine) {
                scene.remove(scaleLine);
            }
        } else {
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove('active');
            });
        }
    }
}

document.querySelector('canvas').addEventListener('mousedown', onDocumentMouseDown, false);
document.querySelector('canvas').addEventListener('mousemove', onDocumentMouseMove, false);
document.querySelector('canvas').addEventListener('mouseup', onDocumentMouseUp, false);
document.querySelector('canvas').addEventListener('contextmenu', onDocumentRightClick, false);

window.addEventListener('keydown', onKeyDown, false);

window.addEventListener('resize', onWindowResize, false);
onWindowResize();

// 监听滚轮事件，实现缩放
canvas.addEventListener('wheel', function (event) {
    event.preventDefault();

    // 缩放步进值
    const zoomFactor = 1.05;

    if (event.deltaY < 0) {
        // 滚轮向上，放大
        camera.zoom *= zoomFactor;
    } else {
        // 滚轮向下，缩小
        if (camera.zoom > 1) {
            camera.zoom /= zoomFactor;
        }
    }

    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

function getDataURL(texture) {
    return new Promise((resolve) => {
        const canvasElement = document.createElement('canvas');
        const context = canvasElement.getContext('2d');
        const image = texture.image;

        canvasElement.width = image.width;
        canvasElement.height = image.height;

        context.drawImage(image, 0, 0);

        erasers.forEach(eraser => {
            console.log(eraser)
            const x = (eraser.position.x + backgroundMesh.geometry.parameters.width / 2) * (backgroundMesh.imgWidth / backgroundMesh.geometry.parameters.width);
            const y = (-eraser.position.y + backgroundMesh.geometry.parameters.height / 2) * (backgroundMesh.imgHeight / backgroundMesh.geometry.parameters.height);
            context.beginPath();
            context.arc(x, y, 20, 0, 2 * Math.PI);
            context.fillStyle = '#FFFFFF';
            context.fill();
        })

        lines.forEach(line => {
            const positions = line.geometry.attributes.instanceStart.array;
            const start = new THREE.Vector3(
                (positions[0] + backgroundMesh.geometry.parameters.width / 2) * (backgroundMesh.imgWidth / backgroundMesh.geometry.parameters.width),
                (-positions[1] + backgroundMesh.geometry.parameters.height / 2) * (backgroundMesh.imgHeight / backgroundMesh.geometry.parameters.height),
                positions[2]);
            const end = new THREE.Vector3((positions[positions.length - 3] + backgroundMesh.geometry.parameters.width / 2) * (backgroundMesh.imgWidth / backgroundMesh.geometry.parameters.width),
                (-positions[positions.length - 2] + backgroundMesh.geometry.parameters.height / 2) * (backgroundMesh.imgHeight / backgroundMesh.geometry.parameters.height),
                positions[positions.length - 1]);
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.lineWidth = lineWidth;
            context.strokeStyle = '#000000';
            context.stroke();
        });

        resolve(canvasElement.toDataURL('image/png'));
    });
}

function getBackgroundDataURL() {
    // 临时从场景中移除圆形和叠加图层
    circles.forEach(circle => scene.remove(circle));
    if (overlayMesh) {
        scene.remove(overlayMesh);
    }

    lines.forEach(line => {
        line.material.color.set(0x000000);
    });

    // 渲染一次只包含背景的场景
    renderer.render(scene, camera);

    // 获取 canvas 的 dataURL
    const backgroundDataURL = renderer.domElement.toDataURL('image/png');

    // 重新添加圆形和叠加图层
    circles.forEach(circle => scene.add(circle));
    if (overlayMesh) {
        scene.add(overlayMesh);
    }


    // 再次渲染以显示完整场景
    renderer.render(scene, camera);

    return backgroundDataURL;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function sendData() {
    if (!backgroundMesh) {
        alert('No background image uploaded!');
        return;
    }

    const dataURL = await getDataURL(backgroundMesh.material.map);

    const circleData = circles.map(circle => ({
        x: (circle.position.x + backgroundMesh.geometry.parameters.width / 2)
            * (backgroundMesh.imgWidth / backgroundMesh.geometry.parameters.width),
        y: (-circle.position.y + backgroundMesh.geometry.parameters.height / 2)
            * (backgroundMesh.imgHeight / backgroundMesh.geometry.parameters.height),
        router: circle.router,
        editor_x: circle.position.x,
        editor_y: circle.position.y,
    }));

    console.log('circles', circles[0].position.x, circles[0].position.y)
    console.log('circleData', circleData[0].x, circleData[0].y, circleData[0].router)

    const data = {
        image: dataURL,
        objects: circleData,
        scale: config.scale,
        signal_frequency: config.signal_frequency
    };

    if (1) {
        loader.show();

        let url = 'api/';
        if (process.env.NODE_ENV === 'production') {
            console.log('We are in production mode');

        } else if (process.env.NODE_ENV === 'development') {
            console.log('We are in development mode');
            url = 'http://127.0.0.1:8080/';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                loader.hide();
                if (result.heatmap) {
                    new THREE.TextureLoader().load(result.heatmap, function (texture) {
                        const imageAspect = texture.image.width / texture.image.height;
                        const canvasAspect = window.innerWidth / window.innerHeight;
                        let planeWidth, planeHeight;

                        const scaleFactor = 0.8;

                        if (imageAspect > canvasAspect) {
                            // 如果图像比画布宽（保持宽度一致）
                            planeWidth = window.innerWidth * scaleFactor;
                            planeHeight = (window.innerWidth / imageAspect) * scaleFactor;
                        } else {
                            // 如果图像比画布高（保持高度一致）
                            planeHeight = window.innerHeight * scaleFactor;
                            planeWidth = (window.innerHeight * imageAspect) * scaleFactor;
                        }

                        if (overlayMesh) {
                            scene.remove(overlayMesh);
                        }

                        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
                        const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
                        overlayMesh = new THREE.Mesh(geometry, material);
                        overlayMesh.position.set(0, 0, 10); // 确保在屏幕中央

                        overlayMesh.routers = result.routers;

                        scene.add(overlayMesh);
                        resultViewMeshs.push(overlayMesh);

                        const card = document.createElement('div');
                        card.classList = 'card justify-content-between active';
                        card.setAttribute('data-mesh-id', overlayMesh.uuid);
                        card.innerHTML = `
                            <div><img src="${result.heatmap}" class="card-img-top"></div>
                            <div class="info">${result.frequency}GHz</div>
                            <div class="hover-veiw"><i class="bi bi-eye-slash-fill"></i></div>`;
                        resultCards.querySelectorAll('.card').forEach(card => {
                            card.classList.remove('active');
                        });
                        resultCards.append(card);
                        card.addEventListener('click', resultCardsClickEvent);

                        if(resultCards.querySelector('.card')) {
                            resultViewDiv.classList.remove('d-none');
                        }
                    });

                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send data.');
            });
    }
}

sendButton.addEventListener('click', sendData);
document.getElementById('clearButton').addEventListener('click', () => {
    if (overlayMesh) {
        scene.remove(overlayMesh);
    }
    resultViewMeshs.length = 0;
    resultCards.innerHTML = '';
    resultViewDiv.classList.add('d-none');
})