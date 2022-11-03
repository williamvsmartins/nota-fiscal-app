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
    ActivityIndicator, 
    TouchableOpacity
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import colors from "../styles/colors";

import { TextInputMask } from "react-native-masked-text";
import { Modalize } from "react-native-modalize";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 



import { ClientConfirmation } from "../components/ClientConfirmation";
import { ButtonConfirmation } from "../components/ButtonConfirmation";
import { Header } from "../components/Header";

import { queryCNPJ }  from "../services/api";

interface ClientProps {
        cnpj: String,
        nome: String
}

const schema = yup.object({
    cnpjFormatted: yup.string().min(18, "CNPJ inválido").required("Digite seu CNPJ")
})

export function SearchClient(){

    const navigator = useNavigation();
    const modalizeRef = useRef<Modalize>(null);

    const { control, handleSubmit, formState: {errors}}= useForm({
        resolver: yupResolver(schema)
    })

    const [loading, setLoading] = useState(false)

    const [clientData, setClientData] = useState<ClientProps>({
        nome: "", 
        cnpj: ""
    })
    function goBack() {
        modalizeRef.current?.close();
    }

    async function fetchClient(data){
        setLoading(true)
        Keyboard.dismiss() //fecha o teclado

        let cnpj = data.cnpjFormatted.replace(/([^\d])+/gim, ''); //limpa o cnpj e mantém apenas os números

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

    function handleClient() {
        navigator.navigate('NoteDetailing', {
            cnpjClient: clientData.cnpj,
            nameClient: clientData.nome
        })
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
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    🧾
                                </Text>
                                <Text style={styles.title}>
                                    Emita Notas Fiscais de um jeito  {'\n'}
                                    simples e prático!
                                </Text>
                            </View>
                            
                            <View style={styles.form}>
                                
                                <View style={styles.inputCNPJArea}>
                                    <Controller
                                        control={control}
                                        name="cnpjFormatted"
                                        render= {({ field: { onChange, onBlur, value}}) => (
                                            <TextInputMask
                                                placeholderTextColor={colors.gray_dark}
                                                placeholder="Insira o CNPJ"
                                                maxLength={18}
                                                style={[
                                                    styles.inputCNPJ, {
                                                        borderWidth: errors.cnpjFormatted && 2,
                                                        borderColor: errors.cnpjFormatted && colors.red
                                                    }]}
                                                onBlur={onBlur}
                                                type="cnpj"
                                                value={value}
                                                onChangeText={onChange}
                                            />
                                          )}
                                     />
                                    

                                    <TouchableOpacity
                                        disabled={loading}
                                        onPress={handleSubmit(fetchClient)}
                                        style={styles.icon}
                                    >   
                                    { loading ? (
                                            <ActivityIndicator
                                                animating={loading}
                                                size="large"
                                                color={colors.white}
                                            />
                                        ) : (
                                            <FontAwesome5 name="search" size={24} color={colors.white} />
                                    )}
                                      
                                    </TouchableOpacity>
                                    
                                </View>
                                {errors.cnpjFormatted && 
                                <Text style={styles.labelError}>{errors.cnpjFormatted?.message}</Text>
                                }
                            </View>
                        </View> 
                        <Modalize
                            ref={modalizeRef}
                            snapPoint={800}
                        >
                            <ClientConfirmation
                                data={clientData}
                            />
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    onPress={goBack}
                                    style={styles.backButton}
                                > 
                                   <Ionicons name="md-close" size={30} color={colors.white} />
                                </TouchableOpacity>
                                <View style={styles.buttonConfirmation}>
                                    <ButtonConfirmation 
                                        title={
                                            <Text 
                                                style={{ 
                                                    fontSize: 16,
                                                    color: colors.white,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                    Confirmar
                                            </Text>
                                        }
                                        onPress={handleClient}
                                    />
                                </View>
                                
                            </View>
                    </Modalize>
                        
                    </KeyboardAvoidingView>
                </GestureHandlerRootView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width: '100%',
        backgroundColor: colors.white
    },
    content: {
        flex: 1,
        width: '100%',
        marginTop: getStatusBarHeight()
    },
    form: {
        marginTop: 150,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    header: {
        width: '100%',
        paddingTop: 50,
        alignItems: 'center',
        paddingHorizontal: 30
    },
    emoji: {
        fontSize: 70
    },
    title: {
        fontSize: 22,
        marginTop: 5,
        color: colors.purple,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputCNPJArea:{
        width: '75%',
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.gray,
        alignItems: 'center'
    },
    icon: {
        width: '25%',
        backgroundColor: colors.purple,
        marginLeft: 15,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputCNPJ: {
        width: '100%',
        height: 60,
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.purple
    },
    backButton:{
        width: '20%',
        backgroundColor: colors.red,
        marginLeft: 15,
        borderRadius: 10,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        width: '100%',
        flexDirection:'row',
        marginTop: 20
    },
    buttonConfirmation: {
       width: '70%',
       alignItems:'flex-end',
       marginLeft: 10
    },
    labelError: {
        color: colors.red,
        marginLeft: 2
    }
})