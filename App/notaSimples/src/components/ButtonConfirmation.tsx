import React, { Component } from "react";
import { 
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps
} from 'react-native';

import colors from "../styles/colors";

interface ButtonConfirmationProps extends TouchableOpacityProps {
    title: any;
}

export function ButtonConfirmation({ title, ...rest} : ButtonConfirmationProps) {
    return (
        <TouchableOpacity 
            style={styles.container}
            {...rest}
        >
            {title}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container : {
        width: '100%',
        backgroundColor: colors.purple,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
});