import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

async function loadBackend() {
    await tf.setBackend('rn-webgl');
    await tf.ready();
    return tf.getBackend();
}

export default function App() {
    const [result, setResult] = useState(['backend not loaded', false]);

    if (!result[1]) {
	loadBackend()
	    .then((backend) => setResult([`Successfully loaded ${backend} backend`, true]))
	    .catch((e) => setResult([`Failed to load backend: ${e}`, true]));
    }
    
    return (
	<View style={styles.container}>
            <Text>{result[0]}</Text>
            <StatusBar style="auto" />
	</View>
    );
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#fff',
	alignItems: 'center',
	justifyContent: 'center',
    },
});
