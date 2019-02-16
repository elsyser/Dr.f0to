import json

from tensorflow.keras.applications.inception_resnet_v2 import InceptionResNetV2
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg19 import VGG19
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.layers import Conv2D, Dense, Flatten, Input
from tensorflow.keras.models import Model
from tensorflow.keras.utils import plot_model

from . import dataloader

__all__ = [
    'DFSystem',
    'TransferLearning',
    'ConvNet',
]


class DFSystem:
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

class TransferLearning(DFSystem):
    def __init__(self, model_name, num_bottom_layers_to_keep=20):
        self.model_name = model_name
        self.num_bottom_layers_to_keep = num_bottom_layers_to_keep
    
        self.model = None
        self._init_model()

    def _init_model(self):
        # Input
        X_input = Input(shape=dataloader.IMG_SHAPE)
        
        # Reshape with convolution to (h, w, 3)
        X = Conv2D(3, kernel_size=[1, 1], strides=[1, 1], padding='SAME', activation='relu')(X_input)
        
        # Inception-Resnet
        base_model = self._get_base_model()
        X = base_model(X)
        
        X = Flatten()(X)
        X = Dense(units=2048, activation='relu')(X)
        Y = Dense(units=len(dataloader.LABELS_MAP.values()), activation='softmax')(X)
        
        self.model = Model(inputs=X_input, outputs=Y)

        for layer in self.model.layers[:self.num_bottom_layers_to_keep]:
            layer.trainable = False
        for layer in self.model.layers[self.num_bottom_layers_to_keep:]:
            layer.trainable = True

        return self.model

    def _get_base_model(self):
        if self.model_name == 'inception_v3':
            return InceptionV3(weights='imagenet', include_top=False)
        elif self.model_name == 'inception_resnet_v2':
            return InceptionResNetV2(weights='imagenet', include_top=False)
        elif self.model_name == 'vgg16':
            return VGG16(weights='imagenet', include_top=False)
        elif self.model_name == 'vgg19':
            return VGG19(weights='imagenet', include_top=False)
        elif self.model_name == 'resnet50':
            return ResNet50(weights='imagenet', include_top=False)
        else:
            raise ValueError('Cannot find base model %s' % self.model_name)

class ConvNet(DFSystem):
    def __init__(self, img_shape, filters=10, kernel_size=(3, 3), activation='relu', verbose=False):

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
