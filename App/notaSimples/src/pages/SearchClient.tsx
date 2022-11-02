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
    ActivityIndicator 
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import colors from "../styles/colors";

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

    const [loading, setLoading] = useState(false)
    const [cnpjFormatted, setCnpjFormatted] = useState('')
    const [clientData, setClientData] = useState<ClientProps>({
        nome: "", 
        cnpj: ""
    })

    async function fetchClient(){
        setLoading(true)
        Keyboard.dismiss() //fecha o teclado

        let cnpj = cnpjFormatted.replace(/([^\d])+/gim, ''); //limpa o cnpj e mantém apenas os números

        try {
            const { data } = await queryCNPJ.get(`${cnpj}`)
            if(data.status !=  "ERROR"){
                setClientData(data)
                setLoading(false)
                modalizeRef.current?.open(); //abre modal
            } else if (data.status ==  "ERROR") {
                Alert.alert(data.message);
                setLoading(false)
            }
        } catch(error) {
            setLoading(false)
            console.log(error)
            Alert.alert("Excedeu o limite de buscas");
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
                                        title={ loading ? (
                                            <ActivityIndicator animating={loading} size="large" color={colors.white} />
                                            ) : (
                                                <Text 
                                                    style={{ 
                                                        fontSize: 16, color: colors.white
                                                    }}
                                                >
                                                        Confirmar
                                                </Text>
                                            )}
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
        borderBottomWidth: 2,
        borderColor: colors.gray,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        color: colors.purple,
        padding: 8,
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center'
    },
    footer: {

    }
})