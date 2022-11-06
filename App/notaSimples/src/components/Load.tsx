import React, {useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from 'lottie-react-native';

import loadAnimation from '../assets/load.json'
import colors from "../styles/colors";

export function Load(){

    return (
        <View style={styles.container}>
            <LottieView 
                source={loadAnimation}
                autoPlay
                loop
                style={styles.animation}
            />

            <Text style={styles.title}>Emitindo nota...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    animation: {
        backgroundColor: 'transparent',
        width: 200,
        height: 200
    },
    title: {
        fontSize: 22,
        marginTop: 5,
        color: colors.purple,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})