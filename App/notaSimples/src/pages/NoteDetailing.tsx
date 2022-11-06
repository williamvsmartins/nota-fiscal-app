import React, { useState, useRef } from "react";
import { 
    SafeAreaView,
    KeyboardAvoidingView, //faz com que todo conteúdo permaneça visível quando o teclado é exibido
    TouchableWithoutFeedback, //toque na tela executa uma ação
    Platform,
    Keyboard,
    TouchableOpacity,
    View, 
    Text,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { useNavigation, useRoute } from "@react-navigation/native";
import { Modalize } from "react-native-modalize";

import { Load } from '../components/Load'

import { getLoginStorage } from "../libs/storage";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


import { Ionicons } from '@expo/vector-icons';

import { TextInputMask } from "react-native-masked-text";
import NumericInput from 'react-native-numeric-input'



import { NoteDetailingConfirmation } from "../components/NoteDetailingConfirmation";
import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { apiNFC }  from "../services/api";

import colors from "../styles/colors";

interface RouteParams {
    cnpjClient: string;
    nameClient: string
}

interface DetailingProps {
    cnpjClient: string,
    description: string,
    nameClient: string,
    quantity: Number,
    unitaryValue: string
}

const schema = yup.object({
    description: yup.string().required("Digite uma descrição para seu produto."),
    unitaryValue: yup.string().test(
        'is-42',
        "Digite algum valor",
        (value) => value != "R$0,00",
      ).required("Digite o valor unitário do seu produto"),
    quantity: yup.number().min(1, "Insira a quantidade do seu produto").required("Insira a quantidade do seu produto")
})

export function NoteDetailing() {
    const modalizeRef = useRef<Modalize>(null);

    function goBack() {
        modalizeRef.current?.close();
    }

    const route = useRoute();
    const navigator = useNavigation()

    const { control, handleSubmit, formState: {errors}}= useForm({
        resolver: yupResolver(schema)
    })

    const {
        cnpjClient,
        nameClient
    } = route.params as RouteParams;

    const [detailingData, setDetailingData] = useState<DetailingProps>({
        cnpjClient: "",
        description: "",
        nameClient: "",
        quantity: 0,
        unitaryValue: ""
    })

    const [loading, setLoading] = useState(false)



    const [hidePass, setHidePass] = useState(true)

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)


    async function sendToConfirm(data){
        Keyboard.dismiss()

        setDetailingData(Object.assign(data, {cnpjClient, nameClient}))

        modalizeRef.current?.open();              
    }

    async function handleSend() {
        setLoading(true)
        const userData = await getLoginStorage();

        
        
       try {
            var cnpjFormatted = detailingData.cnpjClient.replace(/([^\d])+/gim, '')
            var quantity = String(detailingData.quantity)
            var value = detailingData.unitaryValue.replace("R$", "")
        
            await apiNFC.post('emitirNota', {
                login: userData.cnpj,
                senha: userData.password,
                cnpj: cnpjFormatted,
                email: userData.email,
                descricao: detailingData.description,
                quantidade: quantity,
                valor: value
            });
            setLoading(false)
            Alert.alert(`Nota fiscal enviada para ${userData.email}`)
            navigator.navigate("SearchClient")
       } catch(e){
         setLoading(false)
         Alert.alert('Erro')
       }
    }

    if(loading)
        return <Load />
    
    return(
        <SafeAreaView  style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
                <GestureHandlerRootView style={styles.container}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
                    
                        <View style={styles.content}>
                            <View style={styles.form}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>
                                        Detalhes  do Serviço
                                    </Text>
                                </View>
                                <View style={styles.identification}>
                                    <Text style={styles.cnpj}> {cnpjClient}</Text>
                                    <Text style={styles.nome}> {nameClient}</Text>
                                </View>
                                {errors.description && 
                                <Text style={styles.labelError}>{errors.description?.message}</Text>
                                }
                                <Controller
                                    control={control}
                                    name="description"
                                    render= {({ field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                        placeholderTextColor={colors.purple}
                                        placeholder="Descrição do produto"
                                        style={[styles.input, {
                                            borderWidth: errors.description && 2,
                                            borderColor: errors.description && colors.red
                                        }]}
                                        value={value}
                                        onChangeText={onChange}
                                        />
                                    )}
                                />
                                <Text style={styles.label}>Valor Unitário</Text>
                                <Controller
                                    control={control}
                                    name="unitaryValue"
                                    render= {({ field: {onChange, onBlur, value}}) => (
                                        <TextInputMask 
                                            type='money'
                                            placeholderTextColor="#9a73ef"
                                            maxLength={11} //quantidade max de dígitos
                                            style={[styles.input, {
                                                borderWidth: errors.unitaryValue && 2,
                                                borderColor: errors.unitaryValue && colors.red
                                            }]}
                                            value={String(value)}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                 
                                <Text style={styles.label}>Quantidade</Text>
                                <Controller
                                        control={control}
                                        name="quantity"
                                        render= {({ field: {onChange, onBlur, value}}) => (
                                            <NumericInput 
                                                value={value} 
                                                onChange={onChange} 
                                                minValue={0}
                                                totalWidth={285} 
                                                totalHeight={50} 
                                                step={1.5}
                                                valueType='integer'
                                                rounded 
                                                iconSize={25}
                                                textColor={colors.purple}
                                                rightButtonBackgroundColor={colors.purple}
                                                leftButtonBackgroundColor={colors.red}
                                            />
                                        )}
                                />
                                {errors.quantity && 
                                <Text style={styles.labelError}>{errors.quantity?.message}</Text>
                                }
                                                                                                            
                                <View style={styles.footer}>
                                    <ButtonConfirmation
                                        title={
                                            <Text 
                                                style={{ 
                                                    fontSize: 16, color: colors.white
                                                }}
                                            >
                                                    Confirmar
                                            </Text>
                                        }
                                        onPress={handleSubmit(sendToConfirm)}
                                    />
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <Modalize
                        ref={modalizeRef}
                        snapPoint={800}
                    >
                        <NoteDetailingConfirmation
                            data={detailingData}
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
                                    onPress={handleSend}
                                />
                            </View>
                        </View>
                    </Modalize>
                </GestureHandlerRootView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: getStatusBarHeight()
    },
    content:{
        flex: 1,
        width: '100%',
    },
    form: {
        flex: 1,
        marginBottom: 100,
        justifyContent: 'center',
        paddingHorizontal: 54,
    },
    header: {
        alignItems: 'center'    
    },
    title:{
        fontSize: 30,
        color: colors.purple,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 30
    },
    identification: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 40
    },
    cnpj: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        color: colors.gray_dark,
        marginTop: 10
    },
    nome: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        color: colors.purple,
    },
    label:{
        fontSize: 15,
        color: colors.purple,
        paddingVertical: 7
    },
    input: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.gray,
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.purple
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
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginTop: 210,
        paddingHorizontal: 20
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
    buttonConfirmation: {
       width: '70%',
       alignItems:'flex-end',
       marginLeft: 10
    },
    labelError: {
        color: colors.red,
        marginLeft: 2
    },
})