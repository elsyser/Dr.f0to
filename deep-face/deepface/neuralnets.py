import json

from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg19 import VGG19
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.layers import (BatchNormalization, Conv2D, Dense, Dropout, Flatten,
                          GlobalAveragePooling2D, MaxPooling2D)
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.utils import plot_model

from . import dataloader

__all__ = [
    'DFNeuralNet',
    'TransferLearningNN',
    'ConvNet',
]


class DFNeuralNet:
    def __init__(self):
        self.model = None

    def _init_model(self):
        raise NotImplementedError("Class %s doesn't implement _init_model()" % self.__class__.__name__)

    def fit(self, x_train, y_train):
        raise NotImplementedError("Class %s doesn't implement fit()" % self.__class__.__name__)

    def predict(self, x):
        return self.model.predict(x)

    def evaluate(self, x, y):
        return self.model.evaluate(x, y)

    def save_model_graph(self, path_to_file='model.png'):
        plot_model(self.model, to_file=path_to_file)

    def export_model(self, model_filepath, weights_filepath):
        self.model.save_weights(weights_filepath)

        model_json_string = self.model.to_json()
        model_json_file = open(model_filepath, 'w')
        model_json_file.write(model_json_string)
        model_json_file.close()

    def load_model(self, model_filepath, weights_filepath):
        # TODO: implement
        pass

class TransferLearningNN(DFNeuralNet):
    def __init__(self, model_name, num_bottom_layers_to_keep=20):
        self.model_name = model_name
        self.num_bottom_layers_to_keep = num_bottom_layers_to_keep
    
        self.model = None
        self._init_model()

    def _init_model(self):
        pass

    def _get_base_model(self):
        if self.model_name == 'inception_v3':
            return InceptionV3(weights='imagenet', include_top=False)
        elif self.model_name == 'vgg16':
            return VGG16(weights='imagenet', include_top=False)
        elif self.model_name == 'vgg19':
            return VGG19(weights='imagenet', include_top=False)
        elif self.model_name == 'resnet50':
            return ResNet50(weights='imagenet', include_top=False)
        else:
            raise ValueError('Cannot find base model %s' % self.model_name)

    def fit(self, x, y, epochs=50):
        """Fine tuning
        """

        for layer in self.model.layers[self.num_bottom_layers_to_keep:]:
            layer.trainable = True

        self.model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        self.model.fit(
            x=x, y=y, epochs=50, verbose=1,
            callbacks=[ReduceLROnPlateau(), EarlyStopping(patience=3)]
        )

class ConvNet(DFNeuralNet):
    def __init__(self, img_shape, filters=10, kernel_size=(4, 4), activation='relu', verbose=False):

        self.img_shape = img_shape        
        self.filters = filters
        self.kernel_size = kernel_size
        self.activation = activation
        self.verbose = verbose

        self.model = None
        self._init_model()

    def _init_model(self):
        # TODO: implement
        pass

    def fit(self, image_data, labels, validation_split, epochs=50):
        self.model.compile(optimizer='RMSprop', loss='categorical_crossentropy', metrics=['accuracy'])
        self.model.fit(image_data, labels, epochs=epochs, validation_split=validation_split,
                       callbacks=[ReduceLROnPlateau(), EarlyStopping(patience=3)])