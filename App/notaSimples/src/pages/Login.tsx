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


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


import { Ionicons } from '@expo/vector-icons';
import { TextInputMask } from "react-native-masked-text";

import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { apiNFC }  from "../services/api";
import { loginAuth } from '../hooks/loginAuth';
import colors from "../styles/colors";

export function Login(){

    const navigator = useNavigation()

    const { handleAuth } = loginAuth();

    const [cnpjFormatted, setCnpjFormatted] = useState('')
    const [password, setPassword] = useState('')

    const [hidePass, setHidePass] = useState(true)

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    async function handleSubmit(){

        let cnpj = cnpjFormatted.replace(/([^\d])+/gim, ''); //limpa o cnpj e mantém apenas os números

        if(!cnpj && password)
            return Alert.alert("Digite seu CNPJ e senha!")

        try {
           
            console.log(cnpj)

            await apiNFC.post('login', {
                login: cnpj,
                senha: password
            });

            await handleAuth({
                cnpj,
                password
            });
            //DEBUG
            const login = await AsyncStorage.getItem('@notaSimples:login');
            console.log(login)

            navigator.navigate("SearchClient")
        } catch(error) {
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
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text>
                                    Login
                                </Text>
                            </View>

                            <Text style={styles.label}>CNPJ</Text>
                            <TextInputMask 
                                placeholderTextColor="#9a73ef"
                                placeholder="Insira seu CNPJ"
                                maxLength={18} //quantidade max de dígitos
                                style={styles.inputCNPJ}
                                type="cnpj"
                                value={cnpjFormatted}
                                onChangeText={ text => setCnpjFormatted(text)}
                            />
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.inputPassArea}>
                                <TextInput style={styles.inputPass}
                                    placeholder="Insira sua senha"
                                    placeholderTextColor="#9a73ef"
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    autoComplete={"off"}
                                    secureTextEntry={hidePass} //transforma em senha oculta
                                />
                                <TouchableOpacity
                                    activeOpacity={0.8} //tempo da opacidade do click
                                    style={styles.icon}
                                    onPress={() => setHidePass(!hidePass)} //Inverte o valor do hidePass
                                > 
                                    { hidePass ? //se for verdadeiro
                                        <Ionicons name="eye"color="#fff" size={25} />
                                        : //se não
                                        <Ionicons name="eye-off"color="#fff" size={25} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footer}>
                                <ButtonConfirmation
                                    title="Confirmar"
                                    disabled={!cnpjFormatted && !password}
                                    onPress={handleSubmit}
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
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content:{
        flex: 1,
        width: '100%'

    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50
    },
    label:{
        marginBottom: 5
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
    inputPassArea: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#121212',
        borderRadius: 5,
        height: 50,
        alignItems: 'center'
    },
    inputPass: {
        width: '83%', //não passa desse tamanho
        height: 50,
        color: '#fff',
        padding: 8,
        fontSize: 18
    },
    icon: {
        width: '15%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20
    }
})
