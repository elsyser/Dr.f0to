import json
import base64

import cv2
import numpy as np
from fer import fer
from flask import Flask, jsonify, request

__all__ = [
    'app',
    'detector',
    'index'
]


app = Flask(__name__)

detector = fer.FER()

@app.route('/', methods=['GET', 'POST'])
def index():
    b64img = request.get_json(force=True)['img']

    with open('b64img', 'w') as f:
        f.write(b64img)

    with open('out.jpg', 'wb') as f:
        f.write(base64.b64decode(b64img))

    img = cv2.imread('out.jpg')
    return jsonify(detector.detect_emotions(img))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
