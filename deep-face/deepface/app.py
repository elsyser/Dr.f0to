import numpy as np
import tensorflow as tf

from EmoPy.src.fermodel import FERModel
from flask import Flask, jsonify, request

__all__ = [
    'app',
    
    'target_mental_states',
    'model',

    'index'
]


app = Flask(__name__)

target_mental_states = ['calm', 'happiness', 'anger']
model = FERModel(target_mental_states, verbose=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    arr2d = request.get_json(force=True)['img']
    
    # with open('tmp', 'w') as f:
    #     f.write(str(arr2d))

    arr2d = list(map(float, arr2d))
    arr2d = np.reshape(arr2d, (48, 48, 1))

    label = np.argmax(model.model.predict([[arr2d]]))
    return target_mental_states[label]


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
