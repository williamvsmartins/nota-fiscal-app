import React from "react";
import { 
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps
} from 'react-native';

import colors from "../styles/colors";

interface ButtonConfirmationProps extends TouchableOpacityProps {
    title: string;
}

export function ButtonConfirmation({ title, ...rest} : ButtonConfirmationProps) {
    return (
        <TouchableOpacity 
            style={styles.container}
            {...rest}
        >
            <Text style={styles.text}>
                { title }
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: colors.purple,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 16,
        color: colors.white,
    }
});