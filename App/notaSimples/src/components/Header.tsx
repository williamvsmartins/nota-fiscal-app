import React from "react";
import {
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

interface HeaderProps{
    title: string,
    name?: string | null | undefined,
    page?: string
}

export function Header({title, name, page, ...rest} : HeaderProps) {
    return (
        <View 
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.title}>
                    Emita Notas Fiscais {'\n'}
                    de um jeito simples e prático!
                </Text>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: getStatusBarHeight()
    },
    content: {
        marginTop: 20
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 22,
        marginTop: 5,
        color: '#61688B'
    }
})

