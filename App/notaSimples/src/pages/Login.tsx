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
    TouchableOpacity,
    ActivityIndicator 
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


import { Ionicons } from '@expo/vector-icons';
import { TextInputMask } from "react-native-masked-text";

import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { apiNFC }  from "../services/api";
import { loginAuth } from '../hooks/loginAuth';
import colors from "../styles/colors";

const schema = yup.object({
    cnpjFormatted: yup.string().min(18, "CNPJ inválido").required("Digite seu CNPJ"),
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
    const [loading, setLoading] = useState(false)
    const [Locked, setLocked] = useState(false)

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    function handleIsLocked(){
        setLocked(true)
        setTimeout(() => {
            setLocked(false);
        }, 180000);

    };
    
    
    async function handleSignIn(data){
        Keyboard.dismiss()
        setLoading(true)
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
           setLoading(false)
           navigator.navigate("SearchClient")

        } catch(error) {
            handleIsLocked()
            setLoading(false)
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
                                <Text style={styles.title}>
                                    Login
                                </Text>
                            </View>
                            {Locked &&
                                <View style={styles.locked}>
                                    <Text style={styles.lockedText}>Erro! Por favor, aguarde!</Text>
                                </View>
                            }
                            <Text style={styles.label}>CNPJ</Text>
                            <Controller
                                 control={control}
                                 name="cnpjFormatted"
                                 render= {({ field: {onChange, onBlur, value}}) => (
                                     <TextInputMask 
                                        style={[
                                            styles.inputCNPJ,{
                                            borderWidth: errors.cnpjFormatted && 2,
                                            borderColor: errors.cnpjFormatted && colors.red
                                        }]}
                                        placeholderTextColor={colors.purple}
                                        placeholder="Insira seu CNPJ"
                                        maxLength={18} //quantidade max de dígitos
                                        returnKeyType="next"
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
                                    <View style={[
                                                styles.inputPassArea, {
                                                borderWidth: errors.cnpjFormatted && 2,
                                                borderColor: errors.cnpjFormatted && colors.red
                                            }]}>
                                        <TextInput style={styles.inputPass}
                                            placeholder="Insira sua senha"
                                            placeholderTextColor={colors.purple}
                                            value={value}
                                            onChangeText={onChange}
                                            autoComplete={"off"}
                                            autoCapitalize={"none"}
                                            secureTextEntry={hidePass} //transforma em senha oculta
                                            returnKeyType="next"
                                        />
                                        <TouchableOpacity
                                            activeOpacity={1} //tempo da opacidade do click
                                            style={styles.icon}
                                            onPress={() => setHidePass(!hidePass)} //Inverte o valor do hidePass
                                        > 
                                            { hidePass ? //se for verdadeiro
                                                <Ionicons name="eye"color={colors.purple} size={25} />
                                                : //se não
                                                <Ionicons name="eye-off"color={colors.purple} size={25} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            {errors.password && 
                                <Text style={styles.labelError}>{errors.password?.message}</Text>
                                
                            }
                            <Text style={styles.label}>E-mail</Text>
                            <Controller
                                 control={control}
                                 name="email"
                                 render={({ field: {onChange, onBlur, value}}) => (
                                    <TextInput style={[
                                            styles.inputCNPJ, {
                                            borderWidth: errors.cnpjFormatted && 2,
                                            borderColor: errors.cnpjFormatted && colors.red
                                        }]}
                                        keyboardType={"email-address"}
                                        placeholder="Insira seu email"
                                        placeholderTextColor={colors.purple}
                                        autoCapitalize={"none"}
                                        value={value}
                                        onChangeText={onChange}
                                        returnKeyType="go"
                                    />
                                 )}
                            />
                            {errors.email && 
                                <Text style={styles.labelError}>{errors.email?.message}</Text>
                                
                            }


                            
                            <View style={styles.footer}>
                                <ButtonConfirmation
                                    title={ loading || Locked ? (
                                        <ActivityIndicator animating={loading || Locked} size="large" color={colors.white} />
                                        ) : (
                                            <Text 
                                                style={{ 
                                                    fontSize: 16, color: colors.white
                                                }}
                                            >
                                                    Confirmar
                                            </Text>
                                        )}
                                    disabled={loading || Locked}
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
        justifyContent: 'space-around',
        backgroundColor: colors.white,
    },
    content:{
        flex: 1,
        width: '100%',
    },
    header: {
        alignItems: 'center'    
    },
    title:{
        fontSize: 30,
        color: colors.purple,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 70
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 50,

    },
    
    label:{
        fontSize: 15,
        color: colors.purple,
        paddingVertical: 7
    },
    inputCNPJ: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.gray,
        alignItems: 'center',
        height: 60,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.purple
    },
    inputPassArea: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.gray,
        alignItems: 'center'
    },
    inputPass: {
        width: '80%',
        height: 60,
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.purple
    },
    icon: {
        width: '10%',
        marginLeft: 15,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20
    },
    labelError: {
        color: colors.red
    },
    locked: {
        marginTop: 20,
        width: '100%',
        height: 65,
        backgroundColor: colors.red,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockedText: {
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
    }
})
