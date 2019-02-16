import tensorflow as tf

__all__ = [
    'conv2d_layer',
    'max_pool',
    'dense_layer',
]


def conv2d_layer(input_X, n_filters=3, size=[1, 1], strides=[1, 1, 1, 1], padding='VALID', dilations=[1, 1, 1, 1], name='conv2d-layer'):
    _, _, _, n_C = input_X.shape

    with tf.name_scope(name) as nscope:
        with tf.variable_scope(name+'-variables') as vscope:
            W = tf.get_variable(name='W', shape=[*size, n_C, n_filters], initializer=tf.contrib.layers.xavier_initializer())
            b = tf.get_variable(name='b', shape=[1, 1, 1, n_filters], initializer=tf.initializers.zeros())

        Z = tf.nn.conv2d(input_X, W, strides=strides, padding=padding, dilations=dilations)
        Z = Z + b

    return Z

def max_pool(input_X, size=[1, 1], strides=[1, 1, 1, 1], padding='VALID', name='max-pool-layer'):
    with tf.name_scope(name) as nscope:
        pool =  tf.nn.max_pool(input_X, ksize=[1, *size, 1], strides=strides, padding=padding, name='max-pool')
        
    return pool

def dense_layer(A_prev, units=1, activation=None, name='dense-layer'):
    with tf.name_scope(name) as nscope:
        with tf.variable_scope(name+'-variables') as vscope:
            W = tf.get_variable(name='W', shape=[A_prev.shape[1], units], initializer=tf.initializers.he_normal())
            b = tf.get_variable(name='b', shape=[1, units], initializer=tf.initializers.he_normal())

        Z = A_prev @ W  + b
        if activation:
            return activation(Z)
        else:
            return Z
