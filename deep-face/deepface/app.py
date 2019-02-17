import json
import base64

import cv2
import numpy as np
from fer import fer
from flask import Flask, request

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
    b64img = b64img.split(',')[-1]

    with open('b64img', 'w') as f:
        f.write(b64img)

    with open('out.jpg', 'wb') as f:
        f.write(base64.b64decode(b64img))

    img = cv2.imread('out.jpg')
    try:
        res = detector.detect_emotions(img)[0]
    except IndexError:
        print('Face Not Found')
        return json.dumps({'res': 'Face Not Found'})


    # Parse NumPy array
    res['box'] = res['box'].tolist()
    # Parse Floats
    for key, val in res['emotions'].items():
        res['emotions'][key] = str(val)

    try:
        return json.dumps({'res': res})
    except TypeError:
        print('Type Error')
        return json.dumps({'res': 'Type Error'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
