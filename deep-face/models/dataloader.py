import numpy as np
import pandas as pd

__all__ = [
    'PATH_TO_IMAGES',
    'IMG_SHAPE',
    'LABELS_MAP',

    'parse_pixelstr',
    'train_dev_test_sets',
]


PATH_TO_IMAGES = '../data/fer/fer2013.csv'
IMG_SHAPE = (48, 48)
LABELS_MAP = {
    0: 'Angry',
    1: 'Disgust',
    2: 'Fear',
    3: 'Happy',
    4: 'Sad',
    5: 'Surprise',
    6: 'Neutral',
}


def parse_pixelstr(pixelstr, shape=IMG_SHAPE):
    """Parse the data: A string of pixels to 2d array
    """
    return np.array(list(map(int, pixelstr.split(' ')))).reshape(shape)

def train_dev_test_sets():
    """Performs train/dev/test set split and retuns the sets
    """

    X_train, X_dev, X_test = [], [], []
    y_train, y_dev, y_test = [], [], []

    images = pd.read_csv(PATH_TO_IMAGES)
    for _, row in images.iterrows():
        if row['Usage'] == 'Training':
            X_train.append(parse_pixelstr(row['pixels']))
            y_train.append(row['emotion'])
            
        elif row['Usage'] == 'PublicTest':
            X_test.append(parse_pixelstr(row['pixels']))
            y_test.append(row['emotion'])
            
        else: # Private Test set or Dev set
            X_dev.append(parse_pixelstr(row['pixels']))
            y_dev.append(row['emotion'])

    return (
        (X_train, y_train),
        (X_dev, y_dev),
        (X_test, y_test),
    )
