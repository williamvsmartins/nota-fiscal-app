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

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


import { Ionicons } from '@expo/vector-icons';
import { TextInputMask } from "react-native-masked-text";

import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { apiNFC }  from "../services/api";
import { loginAuth } from '../hooks/loginAuth';
import colors from "../styles/colors";

const schema = yup.object({
    cnpjFormatted: yup.string().min(18, "CNPJ Incompleto").required("Digite seu CNPJ"),
    password: yup.string().required("Digite sua senha"),
    email: yup.string().email("E-mail Inválido").required("Digite seu E-mail para que você possa receber as notas emitidas")
})

export function Login(){

    const navigator = useNavigation()

    const { control, handleSubmit, formState: {errors}}= useForm({
        resolver: yupResolver(schema)
    })

    const { handleAuth } = loginAuth();

    const [hidePass, setHidePass] = useState(true)
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    
    async function handleSignIn(data){
        let cnpj = data.cnpjFormatted.replace(/([^\d])+/gim, '')
        let password =  data.password
        let email = data.email

        try {
           await apiNFC.post('login', {
                login: data.cnpjFormatted.replace(/([^\d])+/gim, ''),
                senha: data.password
            });

            await handleAuth({
                cnpj,
                password,
                email
            });
            //DEBUG
            const salvo = await AsyncStorage.getItem('@notaSimples:login');
           console.log(salvo)
           Alert.alert('Logado com sucesso');
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
                            <Controller
                                 control={control}
                                 name="cnpjFormatted"
                                 render= {({ field: {onChange, onBlur, value}}) => (
                                    <TextInputMask 
                                        placeholderTextColor="#9a73ef"
                                        placeholder="Insira seu CNPJ"
                                        maxLength={18} //quantidade max de dígitos
                                        style={styles.inputCNPJ}
                                        onBlur={onBlur}
                                        type="cnpj"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                 )}
                            />
                            {errors.cnpjFormatted && 
                                <Text style={styles.labelError}>{errors.cnpjFormatted?.message}</Text>
                                
                            }
                             
                            <Text style={styles.label}>Senha</Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: {onChange, onBlur, value}}) => (
                                    <View style={styles.inputPassArea}>
                                        <TextInput style={styles.inputPass}
                                            placeholder="Insira sua senha"
                                            placeholderTextColor="#9a73ef"
                                            value={value}
                                            onChangeText={onChange}
                                            autoComplete={"off"}
                                            autoCapitalize={"none"}
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
                                )}
                            />
                            {errors.password && 
                                <Text style={styles.labelError}>{errors.password?.message}</Text>
                                
                            }

                            <Controller
                                 control={control}
                                 name="email"
                                 render={({ field: {onChange, onBlur, value}}) => (
                                    <TextInput style={styles.inputCNPJ}
                                        keyboardType={"email-address"}
                                        placeholder="Insira seu email"
                                        placeholderTextColor="#9a73ef"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                 )}
                            />
                            {errors.email && 
                                <Text style={styles.labelError}>{errors.email?.message}</Text>
                                
                            }
                            
                            <View style={styles.footer}>
                                <ButtonConfirmation
                                    title="Confirmar"
                                   // disabled={!cnpjFormatted && !password}
                                    onPress={handleSubmit(handleSignIn)}
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
    },
    labelError: {

    }
})
