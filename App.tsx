import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const modelDirName = 'model';
const modelJson = require(`./assets/${modelDirName}/model.json`);
const modelWeights = require(`./assets/${modelDirName}/group1-shard1of1.bin`);


async function loadModel() {
    tf.setBackend('rn-webgl');
    await tf.ready();

    const model = await tf.loadGraphModel(
	bundleResourceIO(modelJson, modelWeights));

    // WARM-UP model
    const res = tf.tidy(() =>
	model.predict(tf.zeros([1, 10])),
    ) as tf.Tensor; // <<---------- Error is thrown here

    return model;
}

export default function App() {
    const [model, setModel] = useState<tf.GraphModel | undefined | Error>();

    useEffect(() => {
	if (! model) {
	    loadModel().then(model => {
		setModel(model);
	    })
	}
    }, []);

    return (
	<View style={styles.container}>
            <Text>{
		model instanceof tf.GraphModel
		? model.predict(tf.randomNormal([1,10])).toString()
		: 'loading'
	    }</Text>
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
