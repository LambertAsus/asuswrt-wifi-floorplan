import {Tooltip} from 'bootstrap';
import * as THREE from 'three';
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";

const config = {
    scale: 100,
    signal_frequency: '2.4',
};
window.config = config;

let action = '';
window.action = action;

const signalRange = [
    {index: 0, rssi: 52, color: 0x8ECD88, z: 0},
    {index: 1, rssi: 56, color: 0x9ED38D, z: 0.999},
    {index: 2, rssi: 60, color: 0xB2DA85, z: 0.998},
    {index: 3, rssi: 62, color: 0xC1DF80, z: 0.997},
    {index: 4, rssi: 65, color: 0xFEE576, z: 0.996},
    {index: 5, rssi: 70, color: 0xFDDE77, z: 0.995},
    {index: 6, rssi: 72, color: 0xFCD679, z: 0.994},
    {index: 7, rssi: 75, color: 0xFACB7B, z: 0.993},
    {index: 8, rssi: 76, color: 0xD98386, z: 0.992},
    {index: 9, rssi: 79, color: 0xE2898C, z: 0.991},
    {index: 10, rssi: 81, color: 0xFAECEC, z: 0.990},
    {index: 11, rssi: 83, color: 0xFBF3F4, z: 0.989},
    {index: 12, rssi: 85, color: 0xFEFAFA, z: 0.988},
];

const routerList = [
    {
        name: 'RT-BE92U',
        img: 'img/RT-BE92U.png',
        tx: 0,
        number_of_antennas_2g: 3,
        number_of_antennas_5g: 2,
        number_of_antennas_6g: 2,
        range: '25 m²',
        wifi_version: 'WiFi7',
        pattern: {
            "2g": [
                [1.871, 1.883, 1.894, 1.905, 1.916, 1.926, 1.936, 1.945, 1.954, 1.962, 1.97, 1.978, 1.985, 1.992, 1.998, 2.004, 2.009, 2.015, 2.02, 2.024, 2.028, 2.032, 2.036, 2.039, 2.042, 2.044, 2.047, 2.048, 2.05, 2.051, 2.052, 2.053, 2.054, 2.054, 2.053, 2.053, 2.052, 2.051, 2.05, 2.048, 2.046, 2.044, 2.041, 2.038, 2.034, 2.031, 2.027, 2.022, 2.017, 2.012, 2.006, 2, 1.994, 1.987, 1.98, 1.972, 1.964, 1.955, 1.946, 1.936, 1.926, 1.916, 1.905, 1.893, 1.882, 1.869, 1.856, 1.843, 1.829, 1.815, 1.8, 1.785, 1.769, 1.753, 1.737, 1.72, 1.702, 1.685, 1.667, 1.648, 1.63, 1.611, 1.592, 1.572, 1.553, 1.533, 1.513, 1.493, 1.473, 1.453, 1.432, 1.412, 1.392, 1.372, 1.352, 1.333, 1.313, 1.294, 1.276, 1.257, 1.239, 1.222, 1.205, 1.188, 1.172, 1.157, 1.142, 1.128, 1.115, 1.102, 1.091, 1.08, 1.07, 1.061, 1.053, 1.045, 1.039, 1.034, 1.029, 1.026, 1.023, 1.022, 1.022, 1.022, 1.024, 1.026, 1.03, 1.035, 1.04, 1.047, 1.054, 1.063, 1.072, 1.082, 1.093, 1.104, 1.117, 1.13, 1.144, 1.159, 1.174, 1.19, 1.206, 1.223, 1.24, 1.258, 1.276, 1.294, 1.313, 1.332, 1.351, 1.371, 1.39, 1.41, 1.43, 1.449, 1.469, 1.489, 1.508, 1.528, 1.547, 1.567, 1.586, 1.604, 1.623, 1.641, 1.659, 1.677, 1.694, 1.711, 1.728, 1.744, 1.76, 1.775, 1.79, 1.805, 1.819, 1.832, 1.846, 1.858],
                [-0.883, -0.885, -0.88, -0.868, -0.849, -0.823, -0.791, -0.753, -0.708, -0.658, -0.602, -0.541, -0.475, -0.405, -0.331, -0.254, -0.173, -0.09, -0.005, 0.082, 0.17, 0.259, 0.348, 0.437, 0.527, 0.615, 0.703, 0.79, 0.875, 0.959, 1.041, 1.12, 1.197, 1.272, 1.344, 1.412, 1.478, 1.541, 1.6, 1.655, 1.707, 1.755, 1.798, 1.838, 1.873, 1.904, 1.93, 1.952, 1.968, 1.98, 1.987, 1.989, 1.986, 1.977, 1.963, 1.944, 1.92, 1.89, 1.855, 1.814, 1.768, 1.717, 1.66, 1.598, 1.531, 1.459, 1.382, 1.3, 1.214, 1.123, 1.028, 0.929, 0.827, 0.721, 0.612, 0.5, 0.386, 0.271, 0.154, 0.036, -0.082, -0.2, -0.316, -0.432, -0.545, -0.655, -0.762, -0.865, -0.964, -1.057, -1.144, -1.225, -1.298, -1.365, -1.424, -1.474, -1.517, -1.551, -1.576, -1.593, -1.601, -1.601, -1.592, -1.576, -1.552, -1.521, -1.483, -1.438, -1.388, -1.332, -1.271, -1.206, -1.136, -1.063, -0.987, -0.909, -0.829, -0.747, -0.664, -0.58, -0.497, -0.414, -0.331, -0.25, -0.17, -0.092, -0.017, 0.056, 0.126, 0.193, 0.256, 0.316, 0.371, 0.423, 0.47, 0.512, 0.55, 0.583, 0.611, 0.634, 0.653, 0.666, 0.674, 0.677, 0.675, 0.668, 0.656, 0.64, 0.619, 0.593, 0.563, 0.529, 0.49, 0.448, 0.403, 0.354, 0.302, 0.247, 0.19, 0.131, 0.069, 0.007, -0.057, -0.121, -0.185, -0.25, -0.313, -0.376, -0.437, -0.496, -0.553, -0.606, -0.657, -0.703, -0.745, -0.782, -0.814, -0.84, -0.861, -0.875],
                [-6.767, -7.074, -7.494, -8.04, -8.725, -9.551, -10.498, -11.497, -12.38, -12.865, -12.69, -11.869, -10.676, -9.38, -8.136, -7.005, -6.002, -5.122, -4.354, -3.686, -3.105, -2.602, -2.165, -1.787, -1.461, -1.181, -0.943, -0.741, -0.572, -0.432, -0.32, -0.232, -0.166, -0.12, -0.094, -0.086, -0.095, -0.122, -0.167, -0.23, -0.312, -0.412, -0.531, -0.667, -0.818, -0.981, -1.153, -1.328, -1.501, -1.667, -1.817, -1.948, -2.055, -2.134, -2.185, -2.21, -2.211, -2.196, -2.172, -2.148, -2.134, -2.142, -2.18, -2.261, -2.392, -2.585, -2.847, -3.187, -3.613, -4.132, -4.75, -5.469, -6.29, -7.2, -8.172, -9.145, -10.017, -10.642, -10.891, -10.727, -10.236, -9.558, -8.817, -8.089, -7.414, -6.809, -6.281, -5.83, -5.455, -5.153, -4.924, -4.765, -4.674, -4.648, -4.68, -4.763, -4.884, -5.026, -5.167, -5.28, -5.339, -5.317, -5.201, -4.987, -4.686, -4.318, -3.905, -3.472, -3.036, -2.611, -2.206, -1.826, -1.474, -1.148, -0.849, -0.574, -0.321, -0.088, 0.126, 0.322, 0.502, 0.666, 0.813, 0.941, 1.05, 1.138, 1.203, 1.242, 1.253, 1.235, 1.185, 1.103, 0.987, 0.839, 0.659, 0.45, 0.213, -0.045, -0.321, -0.607, -0.895, -1.178, -1.446, -1.69, -1.903, -2.078, -2.211, -2.301, -2.348, -2.359, -2.341, -2.301, -2.251, -2.2, -2.159, -2.137, -2.14, -2.177, -2.252, -2.368, -2.529, -2.734, -2.983, -3.273, -3.598, -3.95, -4.32, -4.693, -5.055, -5.388, -5.677, -5.91, -6.08, -6.191, -6.253, -6.285, -6.309, -6.346, -6.422, -6.555]
            ],
            "5g": [
                [0.048, 0.082, 0.116, 0.151, 0.185, 0.218, 0.251, 0.284, 0.315, 0.346, 0.376, 0.404, 0.431, 0.457, 0.481, 0.504, 0.525, 0.544, 0.562, 0.578, 0.591, 0.603, 0.613, 0.621, 0.626, 0.63, 0.631, 0.63, 0.627, 0.622, 0.615, 0.605, 0.594, 0.58, 0.564, 0.545, 0.525, 0.502, 0.478, 0.451, 0.422, 0.392, 0.36, 0.325, 0.29, 0.252, 0.213, 0.173, 0.131, 0.089, 0.045, 0.001, -0.044, -0.09, -0.136, -0.181, -0.227, -0.273, -0.318, -0.362, -0.405, -0.447, -0.488, -0.527, -0.565, -0.6, -0.633, -0.663, -0.691, -0.716, -0.739, -0.758, -0.774, -0.786, -0.795, -0.801, -0.804, -0.803, -0.799, -0.791, -0.78, -0.766, -0.749, -0.729, -0.706, -0.68, -0.653, -0.622, -0.59, -0.556, -0.521, -0.484, -0.446, -0.407, -0.367, -0.327, -0.286, -0.245, -0.204, -0.164, -0.123, -0.084, -0.045, -0.007, 0.03, 0.065, 0.1, 0.133, 0.164, 0.194, 0.222, 0.248, 0.272, 0.294, 0.314, 0.332, 0.347, 0.361, 0.372, 0.381, 0.388, 0.392, 0.394, 0.394, 0.391, 0.387, 0.379, 0.37, 0.359, 0.345, 0.33, 0.313, 0.294, 0.273, 0.25, 0.226, 0.201, 0.174, 0.147, 0.118, 0.089, 0.059, 0.029, -0.001, -0.032, -0.062, -0.092, -0.121, -0.149, -0.176, -0.202, -0.226, -0.249, -0.27, -0.289, -0.305, -0.32, -0.332, -0.342, -0.349, -0.353, -0.354, -0.353, -0.349, -0.343, -0.334, -0.322, -0.307, -0.29, -0.271, -0.25, -0.227, -0.201, -0.174, -0.146, -0.116, -0.085, -0.053, -0.02, 0.014],
                [0.115, 0.155, 0.206, 0.266, 0.335, 0.414, 0.501, 0.596, 0.697, 0.804, 0.914, 1.028, 1.142, 1.256, 1.369, 1.479, 1.585, 1.685, 1.779, 1.866, 1.945, 2.016, 2.078, 2.13, 2.173, 2.206, 2.229, 2.242, 2.246, 2.24, 2.225, 2.202, 2.169, 2.129, 2.081, 2.027, 1.966, 1.899, 1.828, 1.752, 1.672, 1.59, 1.505, 1.418, 1.331, 1.243, 1.155, 1.068, 0.983, 0.899, 0.817, 0.738, 0.661, 0.588, 0.517, 0.449, 0.384, 0.322, 0.263, 0.205, 0.15, 0.096, 0.044, -0.008, -0.06, -0.112, -0.164, -0.218, -0.274, -0.332, -0.392, -0.455, -0.521, -0.59, -0.663, -0.739, -0.818, -0.901, -0.986, -1.074, -1.165, -1.257, -1.351, -1.446, -1.541, -1.635, -1.728, -1.818, -1.906, -1.99, -2.068, -2.141, -2.207, -2.266, -2.316, -2.358, -2.389, -2.411, -2.422, -2.423, -2.413, -2.394, -2.364, -2.325, -2.278, -2.223, -2.161, -2.094, -2.021, -1.945, -1.866, -1.784, -1.702, -1.62, -1.538, -1.457, -1.378, -1.302, -1.227, -1.156, -1.087, -1.022, -0.96, -0.901, -0.846, -0.794, -0.745, -0.699, -0.656, -0.615, -0.578, -0.543, -0.51, -0.48, -0.452, -0.426, -0.401, -0.378, -0.357, -0.337, -0.317, -0.299, -0.281, -0.263, -0.245, -0.228, -0.21, -0.192, -0.173, -0.154, -0.135, -0.115, -0.095, -0.074, -0.054, -0.034, -0.014, 0.004, 0.022, 0.037, 0.051, 0.063, 0.072, 0.079, 0.083, 0.085, 0.084, 0.08, 0.075, 0.068, 0.06, 0.051, 0.043, 0.036, 0.032, 0.031, 0.034, 0.043, 0.059, 0.083]
            ],
            "6g": [
                [0.689, 0.741, 0.79, 0.834, 0.874, 0.909, 0.94, 0.965, 0.985, 1, 1.009, 1.012, 1.011, 1.003, 0.991, 0.974, 0.951, 0.925, 0.894, 0.859, 0.82, 0.779, 0.735, 0.689, 0.641, 0.593, 0.543, 0.494, 0.445, 0.397, 0.351, 0.307, 0.265, 0.226, 0.19, 0.157, 0.129, 0.104, 0.084, 0.068, 0.057, 0.05, 0.047, 0.049, 0.055, 0.065, 0.079, 0.097, 0.118, 0.142, 0.169, 0.199, 0.231, 0.265, 0.301, 0.338, 0.376, 0.414, 0.453, 0.491, 0.529, 0.566, 0.601, 0.635, 0.666, 0.696, 0.722, 0.745, 0.765, 0.782, 0.794, 0.803, 0.807, 0.806, 0.802, 0.792, 0.778, 0.759, 0.736, 0.708, 0.675, 0.638, 0.597, 0.552, 0.504, 0.453, 0.398, 0.342, 0.283, 0.224, 0.163, 0.103, 0.043, -0.015, -0.072, -0.126, -0.177, -0.224, -0.267, -0.304, -0.336, -0.362, -0.382, -0.395, -0.401, -0.401, -0.393, -0.38, -0.36, -0.334, -0.302, -0.265, -0.224, -0.179, -0.131, -0.08, -0.028, 0.026, 0.081, 0.135, 0.189, 0.241, 0.291, 0.339, 0.384, 0.426, 0.464, 0.498, 0.527, 0.552, 0.572, 0.586, 0.596, 0.601, 0.6, 0.594, 0.583, 0.567, 0.546, 0.521, 0.491, 0.458, 0.421, 0.38, 0.337, 0.292, 0.245, 0.198, 0.149, 0.102, 0.055, 0.009, -0.034, -0.073, -0.11, -0.142, -0.169, -0.191, -0.207, -0.216, -0.22, -0.216, -0.207, -0.19, -0.167, -0.138, -0.102, -0.062, -0.016, 0.034, 0.088, 0.145, 0.205, 0.266, 0.329, 0.392, 0.454, 0.516, 0.576, 0.634],
                [-0.076, -0.052, -0.027, -0.002, 0.022, 0.047, 0.072, 0.097, 0.121, 0.146, 0.17, 0.194, 0.218, 0.241, 0.264, 0.286, 0.308, 0.329, 0.35, 0.37, 0.39, 0.408, 0.426, 0.443, 0.46, 0.475, 0.49, 0.504, 0.517, 0.528, 0.539, 0.549, 0.558, 0.566, 0.573, 0.579, 0.584, 0.589, 0.592, 0.595, 0.597, 0.598, 0.599, 0.599, 0.599, 0.598, 0.597, 0.597, 0.596, 0.595, 0.595, 0.594, 0.595, 0.595, 0.597, 0.599, 0.601, 0.605, 0.609, 0.615, 0.621, 0.628, 0.636, 0.645, 0.655, 0.665, 0.677, 0.689, 0.701, 0.714, 0.727, 0.741, 0.754, 0.767, 0.78, 0.793, 0.805, 0.817, 0.827, 0.837, 0.845, 0.852, 0.858, 0.862, 0.864, 0.865, 0.864, 0.862, 0.857, 0.85, 0.842, 0.831, 0.819, 0.804, 0.788, 0.77, 0.75, 0.728, 0.705, 0.68, 0.653, 0.626, 0.597, 0.567, 0.537, 0.505, 0.473, 0.441, 0.408, 0.375, 0.342, 0.309, 0.276, 0.244, 0.212, 0.18, 0.15, 0.12, 0.091, 0.063, 0.035, 0.009, -0.017, -0.041, -0.064, -0.087, -0.109, -0.129, -0.149, -0.168, -0.186, -0.204, -0.221, -0.237, -0.252, -0.267, -0.282, -0.296, -0.309, -0.322, -0.334, -0.346, -0.357, -0.368, -0.378, -0.387, -0.396, -0.404, -0.411, -0.418, -0.423, -0.428, -0.432, -0.434, -0.436, -0.436, -0.435, -0.433, -0.43, -0.426, -0.42, -0.413, -0.404, -0.395, -0.384, -0.372, -0.358, -0.344, -0.328, -0.312, -0.294, -0.275, -0.256, -0.235, -0.214, -0.193, -0.17, -0.147, -0.124, -0.1]
            ]
        }
    },
    {
        name: 'RT-AX92U',
        img: 'img/RT-AX92U.png',
        tx: 24,
        number_of_antennas_2g: 3,
        number_of_antennas_5g: 2,
        number_of_antennas_6g: 2,
        range: '50 m²',
        wifi_version: 'WiFi6',
        pattern: {
            "2g": [
                [1.871, 1.883, 1.894, 1.905, 1.916, 1.926, 1.936, 1.945, 1.954, 1.962, 1.97, 1.978, 1.985, 1.992, 1.998, 2.004, 2.009, 2.015, 2.02, 2.024, 2.028, 2.032, 2.036, 2.039, 2.042, 2.044, 2.047, 2.048, 2.05, 2.051, 2.052, 2.053, 2.054, 2.054, 2.053, 2.053, 2.052, 2.051, 2.05, 2.048, 2.046, 2.044, 2.041, 2.038, 2.034, 2.031, 2.027, 2.022, 2.017, 2.012, 2.006, 2, 1.994, 1.987, 1.98, 1.972, 1.964, 1.955, 1.946, 1.936, 1.926, 1.916, 1.905, 1.893, 1.882, 1.869, 1.856, 1.843, 1.829, 1.815, 1.8, 1.785, 1.769, 1.753, 1.737, 1.72, 1.702, 1.685, 1.667, 1.648, 1.63, 1.611, 1.592, 1.572, 1.553, 1.533, 1.513, 1.493, 1.473, 1.453, 1.432, 1.412, 1.392, 1.372, 1.352, 1.333, 1.313, 1.294, 1.276, 1.257, 1.239, 1.222, 1.205, 1.188, 1.172, 1.157, 1.142, 1.128, 1.115, 1.102, 1.091, 1.08, 1.07, 1.061, 1.053, 1.045, 1.039, 1.034, 1.029, 1.026, 1.023, 1.022, 1.022, 1.022, 1.024, 1.026, 1.03, 1.035, 1.04, 1.047, 1.054, 1.063, 1.072, 1.082, 1.093, 1.104, 1.117, 1.13, 1.144, 1.159, 1.174, 1.19, 1.206, 1.223, 1.24, 1.258, 1.276, 1.294, 1.313, 1.332, 1.351, 1.371, 1.39, 1.41, 1.43, 1.449, 1.469, 1.489, 1.508, 1.528, 1.547, 1.567, 1.586, 1.604, 1.623, 1.641, 1.659, 1.677, 1.694, 1.711, 1.728, 1.744, 1.76, 1.775, 1.79, 1.805, 1.819, 1.832, 1.846, 1.858],
                [-0.883, -0.885, -0.88, -0.868, -0.849, -0.823, -0.791, -0.753, -0.708, -0.658, -0.602, -0.541, -0.475, -0.405, -0.331, -0.254, -0.173, -0.09, -0.005, 0.082, 0.17, 0.259, 0.348, 0.437, 0.527, 0.615, 0.703, 0.79, 0.875, 0.959, 1.041, 1.12, 1.197, 1.272, 1.344, 1.412, 1.478, 1.541, 1.6, 1.655, 1.707, 1.755, 1.798, 1.838, 1.873, 1.904, 1.93, 1.952, 1.968, 1.98, 1.987, 1.989, 1.986, 1.977, 1.963, 1.944, 1.92, 1.89, 1.855, 1.814, 1.768, 1.717, 1.66, 1.598, 1.531, 1.459, 1.382, 1.3, 1.214, 1.123, 1.028, 0.929, 0.827, 0.721, 0.612, 0.5, 0.386, 0.271, 0.154, 0.036, -0.082, -0.2, -0.316, -0.432, -0.545, -0.655, -0.762, -0.865, -0.964, -1.057, -1.144, -1.225, -1.298, -1.365, -1.424, -1.474, -1.517, -1.551, -1.576, -1.593, -1.601, -1.601, -1.592, -1.576, -1.552, -1.521, -1.483, -1.438, -1.388, -1.332, -1.271, -1.206, -1.136, -1.063, -0.987, -0.909, -0.829, -0.747, -0.664, -0.58, -0.497, -0.414, -0.331, -0.25, -0.17, -0.092, -0.017, 0.056, 0.126, 0.193, 0.256, 0.316, 0.371, 0.423, 0.47, 0.512, 0.55, 0.583, 0.611, 0.634, 0.653, 0.666, 0.674, 0.677, 0.675, 0.668, 0.656, 0.64, 0.619, 0.593, 0.563, 0.529, 0.49, 0.448, 0.403, 0.354, 0.302, 0.247, 0.19, 0.131, 0.069, 0.007, -0.057, -0.121, -0.185, -0.25, -0.313, -0.376, -0.437, -0.496, -0.553, -0.606, -0.657, -0.703, -0.745, -0.782, -0.814, -0.84, -0.861, -0.875],
                [-6.767, -7.074, -7.494, -8.04, -8.725, -9.551, -10.498, -11.497, -12.38, -12.865, -12.69, -11.869, -10.676, -9.38, -8.136, -7.005, -6.002, -5.122, -4.354, -3.686, -3.105, -2.602, -2.165, -1.787, -1.461, -1.181, -0.943, -0.741, -0.572, -0.432, -0.32, -0.232, -0.166, -0.12, -0.094, -0.086, -0.095, -0.122, -0.167, -0.23, -0.312, -0.412, -0.531, -0.667, -0.818, -0.981, -1.153, -1.328, -1.501, -1.667, -1.817, -1.948, -2.055, -2.134, -2.185, -2.21, -2.211, -2.196, -2.172, -2.148, -2.134, -2.142, -2.18, -2.261, -2.392, -2.585, -2.847, -3.187, -3.613, -4.132, -4.75, -5.469, -6.29, -7.2, -8.172, -9.145, -10.017, -10.642, -10.891, -10.727, -10.236, -9.558, -8.817, -8.089, -7.414, -6.809, -6.281, -5.83, -5.455, -5.153, -4.924, -4.765, -4.674, -4.648, -4.68, -4.763, -4.884, -5.026, -5.167, -5.28, -5.339, -5.317, -5.201, -4.987, -4.686, -4.318, -3.905, -3.472, -3.036, -2.611, -2.206, -1.826, -1.474, -1.148, -0.849, -0.574, -0.321, -0.088, 0.126, 0.322, 0.502, 0.666, 0.813, 0.941, 1.05, 1.138, 1.203, 1.242, 1.253, 1.235, 1.185, 1.103, 0.987, 0.839, 0.659, 0.45, 0.213, -0.045, -0.321, -0.607, -0.895, -1.178, -1.446, -1.69, -1.903, -2.078, -2.211, -2.301, -2.348, -2.359, -2.341, -2.301, -2.251, -2.2, -2.159, -2.137, -2.14, -2.177, -2.252, -2.368, -2.529, -2.734, -2.983, -3.273, -3.598, -3.95, -4.32, -4.693, -5.055, -5.388, -5.677, -5.91, -6.08, -6.191, -6.253, -6.285, -6.309, -6.346, -6.422, -6.555]
            ],
            "5g": [
                [0.048, 0.082, 0.116, 0.151, 0.185, 0.218, 0.251, 0.284, 0.315, 0.346, 0.376, 0.404, 0.431, 0.457, 0.481, 0.504, 0.525, 0.544, 0.562, 0.578, 0.591, 0.603, 0.613, 0.621, 0.626, 0.63, 0.631, 0.63, 0.627, 0.622, 0.615, 0.605, 0.594, 0.58, 0.564, 0.545, 0.525, 0.502, 0.478, 0.451, 0.422, 0.392, 0.36, 0.325, 0.29, 0.252, 0.213, 0.173, 0.131, 0.089, 0.045, 0.001, -0.044, -0.09, -0.136, -0.181, -0.227, -0.273, -0.318, -0.362, -0.405, -0.447, -0.488, -0.527, -0.565, -0.6, -0.633, -0.663, -0.691, -0.716, -0.739, -0.758, -0.774, -0.786, -0.795, -0.801, -0.804, -0.803, -0.799, -0.791, -0.78, -0.766, -0.749, -0.729, -0.706, -0.68, -0.653, -0.622, -0.59, -0.556, -0.521, -0.484, -0.446, -0.407, -0.367, -0.327, -0.286, -0.245, -0.204, -0.164, -0.123, -0.084, -0.045, -0.007, 0.03, 0.065, 0.1, 0.133, 0.164, 0.194, 0.222, 0.248, 0.272, 0.294, 0.314, 0.332, 0.347, 0.361, 0.372, 0.381, 0.388, 0.392, 0.394, 0.394, 0.391, 0.387, 0.379, 0.37, 0.359, 0.345, 0.33, 0.313, 0.294, 0.273, 0.25, 0.226, 0.201, 0.174, 0.147, 0.118, 0.089, 0.059, 0.029, -0.001, -0.032, -0.062, -0.092, -0.121, -0.149, -0.176, -0.202, -0.226, -0.249, -0.27, -0.289, -0.305, -0.32, -0.332, -0.342, -0.349, -0.353, -0.354, -0.353, -0.349, -0.343, -0.334, -0.322, -0.307, -0.29, -0.271, -0.25, -0.227, -0.201, -0.174, -0.146, -0.116, -0.085, -0.053, -0.02, 0.014],
                [0.115, 0.155, 0.206, 0.266, 0.335, 0.414, 0.501, 0.596, 0.697, 0.804, 0.914, 1.028, 1.142, 1.256, 1.369, 1.479, 1.585, 1.685, 1.779, 1.866, 1.945, 2.016, 2.078, 2.13, 2.173, 2.206, 2.229, 2.242, 2.246, 2.24, 2.225, 2.202, 2.169, 2.129, 2.081, 2.027, 1.966, 1.899, 1.828, 1.752, 1.672, 1.59, 1.505, 1.418, 1.331, 1.243, 1.155, 1.068, 0.983, 0.899, 0.817, 0.738, 0.661, 0.588, 0.517, 0.449, 0.384, 0.322, 0.263, 0.205, 0.15, 0.096, 0.044, -0.008, -0.06, -0.112, -0.164, -0.218, -0.274, -0.332, -0.392, -0.455, -0.521, -0.59, -0.663, -0.739, -0.818, -0.901, -0.986, -1.074, -1.165, -1.257, -1.351, -1.446, -1.541, -1.635, -1.728, -1.818, -1.906, -1.99, -2.068, -2.141, -2.207, -2.266, -2.316, -2.358, -2.389, -2.411, -2.422, -2.423, -2.413, -2.394, -2.364, -2.325, -2.278, -2.223, -2.161, -2.094, -2.021, -1.945, -1.866, -1.784, -1.702, -1.62, -1.538, -1.457, -1.378, -1.302, -1.227, -1.156, -1.087, -1.022, -0.96, -0.901, -0.846, -0.794, -0.745, -0.699, -0.656, -0.615, -0.578, -0.543, -0.51, -0.48, -0.452, -0.426, -0.401, -0.378, -0.357, -0.337, -0.317, -0.299, -0.281, -0.263, -0.245, -0.228, -0.21, -0.192, -0.173, -0.154, -0.135, -0.115, -0.095, -0.074, -0.054, -0.034, -0.014, 0.004, 0.022, 0.037, 0.051, 0.063, 0.072, 0.079, 0.083, 0.085, 0.084, 0.08, 0.075, 0.068, 0.06, 0.051, 0.043, 0.036, 0.032, 0.031, 0.034, 0.043, 0.059, 0.083]
            ],
            "6g": [
                [0.689, 0.741, 0.79, 0.834, 0.874, 0.909, 0.94, 0.965, 0.985, 1, 1.009, 1.012, 1.011, 1.003, 0.991, 0.974, 0.951, 0.925, 0.894, 0.859, 0.82, 0.779, 0.735, 0.689, 0.641, 0.593, 0.543, 0.494, 0.445, 0.397, 0.351, 0.307, 0.265, 0.226, 0.19, 0.157, 0.129, 0.104, 0.084, 0.068, 0.057, 0.05, 0.047, 0.049, 0.055, 0.065, 0.079, 0.097, 0.118, 0.142, 0.169, 0.199, 0.231, 0.265, 0.301, 0.338, 0.376, 0.414, 0.453, 0.491, 0.529, 0.566, 0.601, 0.635, 0.666, 0.696, 0.722, 0.745, 0.765, 0.782, 0.794, 0.803, 0.807, 0.806, 0.802, 0.792, 0.778, 0.759, 0.736, 0.708, 0.675, 0.638, 0.597, 0.552, 0.504, 0.453, 0.398, 0.342, 0.283, 0.224, 0.163, 0.103, 0.043, -0.015, -0.072, -0.126, -0.177, -0.224, -0.267, -0.304, -0.336, -0.362, -0.382, -0.395, -0.401, -0.401, -0.393, -0.38, -0.36, -0.334, -0.302, -0.265, -0.224, -0.179, -0.131, -0.08, -0.028, 0.026, 0.081, 0.135, 0.189, 0.241, 0.291, 0.339, 0.384, 0.426, 0.464, 0.498, 0.527, 0.552, 0.572, 0.586, 0.596, 0.601, 0.6, 0.594, 0.583, 0.567, 0.546, 0.521, 0.491, 0.458, 0.421, 0.38, 0.337, 0.292, 0.245, 0.198, 0.149, 0.102, 0.055, 0.009, -0.034, -0.073, -0.11, -0.142, -0.169, -0.191, -0.207, -0.216, -0.22, -0.216, -0.207, -0.19, -0.167, -0.138, -0.102, -0.062, -0.016, 0.034, 0.088, 0.145, 0.205, 0.266, 0.329, 0.392, 0.454, 0.516, 0.576, 0.634],
                [-0.076, -0.052, -0.027, -0.002, 0.022, 0.047, 0.072, 0.097, 0.121, 0.146, 0.17, 0.194, 0.218, 0.241, 0.264, 0.286, 0.308, 0.329, 0.35, 0.37, 0.39, 0.408, 0.426, 0.443, 0.46, 0.475, 0.49, 0.504, 0.517, 0.528, 0.539, 0.549, 0.558, 0.566, 0.573, 0.579, 0.584, 0.589, 0.592, 0.595, 0.597, 0.598, 0.599, 0.599, 0.599, 0.598, 0.597, 0.597, 0.596, 0.595, 0.595, 0.594, 0.595, 0.595, 0.597, 0.599, 0.601, 0.605, 0.609, 0.615, 0.621, 0.628, 0.636, 0.645, 0.655, 0.665, 0.677, 0.689, 0.701, 0.714, 0.727, 0.741, 0.754, 0.767, 0.78, 0.793, 0.805, 0.817, 0.827, 0.837, 0.845, 0.852, 0.858, 0.862, 0.864, 0.865, 0.864, 0.862, 0.857, 0.85, 0.842, 0.831, 0.819, 0.804, 0.788, 0.77, 0.75, 0.728, 0.705, 0.68, 0.653, 0.626, 0.597, 0.567, 0.537, 0.505, 0.473, 0.441, 0.408, 0.375, 0.342, 0.309, 0.276, 0.244, 0.212, 0.18, 0.15, 0.12, 0.091, 0.063, 0.035, 0.009, -0.017, -0.041, -0.064, -0.087, -0.109, -0.129, -0.149, -0.168, -0.186, -0.204, -0.221, -0.237, -0.252, -0.267, -0.282, -0.296, -0.309, -0.322, -0.334, -0.346, -0.357, -0.368, -0.378, -0.387, -0.396, -0.404, -0.411, -0.418, -0.423, -0.428, -0.432, -0.434, -0.436, -0.436, -0.435, -0.433, -0.43, -0.426, -0.42, -0.413, -0.404, -0.395, -0.384, -0.372, -0.358, -0.344, -0.328, -0.312, -0.294, -0.275, -0.256, -0.235, -0.214, -0.193, -0.17, -0.147, -0.124, -0.1]
            ]
        }
    },
    {
        name: 'BM68',
        img: 'img/ExpertWiFi_BM68.png',
        tx: 10,
        number_of_antennas_2g: 3,
        number_of_antennas_5g: 2,
        number_of_antennas_6g: 2,
        range: '50 m²',
        wifi_version: 'WiFi6',
        pattern: {
            "2g": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            "5g": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            "6g": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ]
        }
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

const frequencyButtons = document.querySelectorAll('input[name="freq"]');

frequencyButtons.forEach(button => {
    button.addEventListener('change', () => {
        const activeFrequency = document.querySelector('input[name="freq"]:checked').value;
        config.signal_frequency = activeFrequency;
        console.log('Active Frequency:', activeFrequency);
        refreshRouterWiFiMesh();
    });
});


const scalePanel = document.getElementById('scalePanel');
const scaleInput = document.getElementById('scaleInput');
const scaleRedrawButton = document.getElementById('scaleRedrawButton');
const scaleSaveButton = document.getElementById('scaleSaveButton');
const scaleEditButton = document.getElementById('scaleEditButton');
scaleEditButton.querySelector('span').innerText = `1m : 100px`;
scaleEditButton.addEventListener('click', (e) => {
    action = 'changeScale';
});
scaleRedrawButton.addEventListener('click', (e) => {
    e.preventDefault();
    action = 'changeScale';
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
    action = '';
    refreshRouterWiFiMesh();
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

// selectBackground.show();

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

// WiFi Device 物件列表
const circles = [];
window.circles = circles;

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
const wallZ = 0;

const lineWidth = 10;
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
window.lines = lines;

// scale
let scaleLine = null;
const scaleLines = [];
let scaleStartPoint = null;

const erasers = [];
let erasing = false;


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

function createWifiMesh(circle, range) {
    const scale = config.scale / 100;
    const routerFrequencyMap = {
        '2.4': 2.4e9,
        '5': 5e9,
        '6': 6e9
    };
    const routerFrequency = routerFrequencyMap[config.signal_frequency] || 2.4e9;
    const tx = circle.router.tx;
    let simpleFreq = config.signal_frequency;
    if (simpleFreq === '2.4') {
        simpleFreq = '2';
    }
    const pattern = circle.router.pattern[`${simpleFreq}g`];

    function calculateDirectionalGain(pattern) {
        const N_ant = pattern.length; // 天線的數量
        const directionalGains = [];

        // 對每個角度計算方向性增益
        for (let angleIndex = 0; angleIndex < pattern[0].length; angleIndex++) {
            let sumGains = 0;

            // 對每個天線的增益值進行計算
            for (let antennaIndex = 0; antennaIndex < N_ant; antennaIndex++) {
                sumGains += Math.pow(10, pattern[antennaIndex][angleIndex] / 10);
            }

            // 計算方向性增益
            const directionalGain = 10 * Math.log10(sumGains / N_ant);
            directionalGains.push(directionalGain.toFixed(5));
        }

        return directionalGains;
    }

    let directionGain = calculateDirectionalGain(pattern);
    directionGain = directionGain.slice(45).concat(directionGain.slice(0, 45));
    window.directionGain = directionGain;


    const calculateRadius = (rssi, loss = 0, degree = 0) => {
        return 10 ** ((rssi - 20 * Math.log10(routerFrequency) + 147.55 + tx - loss - directionGain[degree]) / 20) * scale;
    };


    function getIntersections(p1, p2, lines) {
        const crossProduct = (p1, p2, p3) => (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);

        const onSegment = (p1, p2, p) =>
            Math.min(p1.x, p2.x) <= p.x && p.x <= Math.max(p1.x, p2.x) &&
            Math.min(p1.y, p2.y) <= p.y && p.y <= Math.max(p1.y, p2.y);

        const getIntersectionPoint = (p1, p2, p3, p4) => {
            const d1 = crossProduct(p1, p2, p3);
            const d2 = crossProduct(p1, p2, p4);
            const d3 = crossProduct(p3, p4, p1);
            const d4 = crossProduct(p3, p4, p2);

            if (d1 * d2 < 0 && d3 * d4 < 0) {
                const t = ((p3.x - p4.x) * (p1.y - p3.y) - (p3.y - p4.y) * (p1.x - p3.x)) /
                    ((p3.y - p4.y) * (p2.x - p1.x) - (p3.x - p4.x) * (p2.y - p1.y));
                return {x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y)};
            }

            return (d1 === 0 && onSegment(p1, p2, p3)) ? p3 :
                (d2 === 0 && onSegment(p1, p2, p4)) ? p4 :
                    (d3 === 0 && onSegment(p3, p4, p1)) ? p1 :
                        (d4 === 0 && onSegment(p3, p4, p2)) ? p2 : null;
        };

        return lines.reduce((intersections, line) => {
            const positions = line.geometry.attributes.instanceStart.array;
            const p3 = {x: positions[0], y: positions[1]};
            const p4 = {x: positions[positions.length - 3], y: positions[positions.length - 2]};
            const intersection = getIntersectionPoint(p1, p2, p3, p4);
            if (intersection) intersections.push(intersection);
            return intersections;
        }, []);
    }

    const points = [];
    const segments = 180;

    for (let i = 0; i < segments; i++) {
        const radius = calculateRadius(range.rssi, 0, i);

        const theta = (i / segments) * Math.PI * 2;
        const px = radius * Math.cos(theta);
        const py = radius * Math.sin(theta);
        const p1 = {x: circle.position.x, y: circle.position.y};
        const p2 = {x: px + circle.position.x, y: py + circle.position.y};

        const intersections = getIntersections(p1, p2, lines);
        if (intersections.length > 0) {
            const wallData = intersections.map((intersection, index) => {
                const wallLossRadius = calculateRadius(range.rssi, (index + 1) * 15, i);
                const routerToWallDistance = Math.hypot(intersection.x - p1.x, intersection.y - p1.y) * scale;
                return {routerToWallDistance, wallLossRadius, intersection};
            }).sort((a, b) => a.routerToWallDistance - b.routerToWallDistance);

            let finalRadius = radius;
            let cumulativeLoss = 0;

            for (const wall of wallData) {
                if (wall.routerToWallDistance < finalRadius) {
                    cumulativeLoss += 15 * (wallData.indexOf(wall) + 1);
                    finalRadius = calculateRadius(range.rssi, cumulativeLoss, i);
                    if (finalRadius < wall.routerToWallDistance) {
                        finalRadius = wall.routerToWallDistance;
                        break;
                    }
                }
            }

            points.push(new THREE.Vector2(finalRadius * Math.cos(theta), finalRadius * Math.sin(theta)));
        } else {
            points.push(new THREE.Vector2(px, py));
        }
    }

    const shape = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({color: range.color});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `wifi-mesh-${range.index}`;
    mesh.position.set(0, 0, range.z);

    const existingMesh = circle.getObjectByName(`wifi-mesh-${range.index}`);
    if (existingMesh) circle.remove(existingMesh);
    circle.add(mesh);
}


const createRouterMesh = (name, x, y) => {

    const router = routerList.find(router => router.name === name);

    const circleGeometry = new THREE.CircleGeometry(18, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    const hoverCircleGeometry = new THREE.CircleGeometry(22, 32);
    const hoverCircleMaterial = new THREE.MeshBasicMaterial({color: 0x6ea8fe});
    const hoverCircle = new THREE.Mesh(hoverCircleGeometry, hoverCircleMaterial);
    hoverCircle.name = 'hoverCircle';
    hoverCircle.position.set(0, 0, 9);
    circle.add(hoverCircle);

    const outerCircleGeometry = new THREE.CircleGeometry(20, 32);
    const outerCircleMaterial = new THREE.MeshBasicMaterial({color: 0x808080});
    const outerCircle = new THREE.Mesh(outerCircleGeometry, outerCircleMaterial);
    outerCircle.name = 'outerCircle';
    outerCircle.position.set(0, 0, 9);
    circle.add(outerCircle);

    // 載入SVG圖片
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(router.img, function (texture) {
        const svgMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true});
        const svgGeometry = new THREE.PlaneGeometry(20, 20); // 可以調整尺寸
        const svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);
        svgMesh.position.set(0, 0, 10.1); // 略微前移以避免與圓形重疊
        svgMesh.name = 'image';
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

function refreshRouterWiFiMesh() {
    signalRange.forEach(range => {
        circles.forEach(circle => {
            createWifiMesh(circle, range);
        });
    });
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
        // 创建路由器
        const selectedRouterName = routerDiv.querySelector('li.active').getAttribute('data-router-name');
        createRouterMesh(selectedRouterName, point.x, point.y);
    } else {

        // 如果繪製牆壁啟用
        if (wallDiv.classList.contains('active')) {
            if (!isDrawing && !startPoint) {
                isDrawing = true;
                startPoint = point;
                const lineGeometry = new LineGeometry();
                lineGeometry.setPositions([startPoint.x, startPoint.y, wallZ, startPoint.x, startPoint.y, wallZ]);
                const lineMaterial = new LineMaterial({
                    color: 0x000000,
                    linewidth: lineWidth,
                    dashed: false,
                    opacity: 1.0,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    depthTest: false
                });
                drawingLine = new Line2(lineGeometry, lineMaterial);
                drawingLine.renderOrder = 30;
                scene.add(drawingLine);
                lines.push(drawingLine);
            } else {
                // 第二次点击，完成绘制
                startPoint = null;
                drawingLine = null;
                isDrawing = false;
                selectedLine = null;
            }
        } else if (action === 'changeScale') {
            if (!isDrawing && !scaleStartPoint) {
                isDrawing = true;
                scaleStartPoint = point;
                const lineGeometry = new LineGeometry();
                lineGeometry.setPositions([scaleStartPoint.x, scaleStartPoint.y, wallZ, scaleStartPoint.x, scaleStartPoint.y, wallZ]);
                const lineMaterial = new LineMaterial({
                    color: 0x000077,
                    linewidth: lineWidth,
                    dashed: false,
                    opacity: 1.0,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    depthTest: false
                });
                scaleLine = new Line2(lineGeometry, lineMaterial);
                scaleLine.renderOrder = 30;
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
    refreshRouterWiFiMesh();
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

    if (wallDiv.classList.contains('active') || (action === "changeScale" && scalePanel.style.display !== 'block')) {
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
                hoveredCircle.children.forEach(child => {
                    if (child.name == "hoverCircle") {
                        child.visible = false;
                    }
                })
            }
            // 显示当前悬停的圆形的外框
            intersectedCircle.children.forEach(child => {
                if (child.name == "hoverCircle") {
                    child.visible = true;
                }
            })
            hoveredCircle = intersectedCircle;
        }

        // 更改鼠标光标为 pointer
        document.body.style.cursor = 'pointer';
    } else {
        if (hoveredCircle) {
            // 隐藏外框
            hoveredCircle.children.forEach(child => {
                if (child.name == "hoverCircle") {
                    child.visible = false;
                }
            })
            hoveredCircle = null;
        }

        // 恢复鼠标光标为默认
        document.body.style.cursor = 'default';
    }

    if (selectedCircle) {
        // 移动已选中的圆形
        // console.log(selectedCircle)
        selectedCircle.position.set(point.x, point.y, circleZ);
        signalRange.forEach(range => {
            circles.forEach(circle => {
                createWifiMesh(circle, range);
            });
        });
    }

    updateHover(point);

    if (wallDiv.classList.contains('active')) {
        if (isDrawing && startPoint && drawingLine) {
            drawingLine.geometry.setPositions([startPoint.x, startPoint.y, wallZ, point.x, point.y, wallZ]);
            drawingLine.computeLineDistances();
        }
    } else if (action === 'changeScale') {
        if (isDrawing && scaleStartPoint && scaleLine) {
            scaleLine.geometry.setPositions([scaleStartPoint.x, scaleStartPoint.y, wallZ, point.x, point.y, wallZ]);
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
                selectedLine.geometry.setPositions([point.x, point.y, wallZ, positions[3], positions[4], wallZ]);
            } else if (selectedEndpoint === "end") {
                selectedLine.geometry.setPositions([positions[0], positions[1], wallZ, point.x, point.y, wallZ]);
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
    selectedLine = null;

    refreshRouterWiFiMesh();
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
}

function onKeyDown(event) {
    if (event.key === "Escape") { // Check if the ESC key was pressed
        console.log("ESC key pressed");
        action = '';

        routerDiv.querySelectorAll('li').forEach(li => {
            li.classList.remove('active');
        });

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

                        if (resultCards.querySelector('.card')) {
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