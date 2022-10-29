import React, { useState } from "react";
import { 
    SafeAreaView,
    KeyboardAvoidingView, //faz com que todo conteúdo permaneça visível quando o teclado é exibido
    TouchableWithoutFeedback, //toque na tela executa uma ação
    Platform,
    Keyboard,
    Alert,
    View, 
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";

export function SearchClient(){
    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>

                        </View>

                    </View>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {

    },
    form: {

    }
})