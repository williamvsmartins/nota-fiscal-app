import React, { useState, useRef } from "react";
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TextInputMask } from "react-native-masked-text";
import { Modalize } from "react-native-modalize";

import { ButtonConfirmation } from "../components/ButtonConfirmation";
import { ClientConfirmation } from "../components/ClientConfirmation";

import { queryCNPJ }  from "../services/api";

interface ClientProps {
        cnpj: String,
        nome: String
}

export function SearchClient(){

    const modalizeRef = useRef<Modalize>(null);

    const [cnpjFormatted, setCnpjFormatted] = useState('')
    const [clientData, setClientData] = useState<ClientProps>({
        nome: "", 
        cnpj: ""
    })

    console.log(clientData)

    async function fetchClient(){
        Keyboard.dismiss() //fecha o teclado

        let cnpj = cnpjFormatted.replace(/([^\d])+/gim, ''); //limpa o cnpj e mantém apenas os números

        if(!cnpj)
            return Alert.alert("Digite o CNPJ")

        try {
           const { data } = await queryCNPJ.get(`${cnpj}`)
           setClientData(data)

           modalizeRef.current?.open(); //abre modal

        } catch(error) {
            console.log(error)
            Alert.alert('Não foi possível acessar sua conta. Verifique seus dados e tente novamente em 3 minutos!');
        }
    }
    return(
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <GestureHandlerRootView style={styles.container}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
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
                    </KeyboardAvoidingView>

                    <Modalize
                        ref={modalizeRef}
                        snapPoint={800}
                    >
                        <ClientConfirmation
                            data={clientData}
                        />
                        
                    </Modalize>
                </GestureHandlerRootView>
            </TouchableWithoutFeedback>
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