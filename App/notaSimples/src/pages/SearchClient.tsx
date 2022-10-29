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

import { TextInputMask } from "react-native-masked-text";

import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { queryCNPJ }  from "../services/api";

export function SearchClient(){

    const [cnpjFormatted, setCnpjFormatted] = useState('')
    const [clientData, setClientData] = useState([])

    console.log(clientData)

    async function fetchClient(){

        let cnpj = cnpjFormatted.replace(/([^\d])+/gim, ''); //limpa o cnpj e mantém apenas os números

        if(!cnpj)
            return Alert.alert("Digite o CNPJ")

        try {
            const { data } = await queryCNPJ.get(`${cnpj}`)
            setClientData(data)

        } catch(error) {
            console.log(cnpj)
            console.log(error)
            Alert.alert('Não foi possível acessar sua conta. Verifique seus dados e tente novamente em 3 minutos!');
        }
    }
    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text>
                                    Digite o CNPJ do cliente para emitir sua nota!
                                </Text>
                            </View>
                            <TextInputMask
                                placeholderTextColor="#9a73ef"
                                placeholder="Insira o CNPJ"
                                maxLength={18}
                                style={styles.inputCNPJ}
                                type="cnpj"
                                value={cnpjFormatted}
                                onChangeText={ text => setCnpjFormatted(text)}
                            
                            />
                            <View style={styles.footer}>
                                <ButtonConfirmation
                                    title="Confirmar"
                                    disabled={!cnpjFormatted}
                                    onPress={fetchClient}
                                />
                            </View>
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

    },
    header: {

    },
    inputCNPJ: {
        width: '100%',
        backgroundColor: '#121212',
        borderRadius: 5,
        height: 50,
        alignItems: 'center',
        color: '#fff',
        padding: 8,
        fontSize: 18,
        marginBottom: 30
    },
    footer: {

    }
})