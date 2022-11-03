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
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Modalize } from "react-native-modalize";

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
    cnpj: string,
    nome: string,
    descricao: string,
    quantidade: string,
    valor: string
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

export function NoteDetailing(){
    const modalizeRef = useRef<Modalize>(null);

    const route = useRoute();
    const navigator = useNavigation()

    const { control, handleSubmit, formState: {errors}}= useForm({
        resolver: yupResolver(schema)
    })

    const {
        cnpjClient,
        nameClient
    } = route.params as RouteParams;

    const [ total, setTotal] = useState(0)

    const [detailingData, setDetailingData] = useState<DetailingProps>({
        cnpj: "",
        nome: "",
        descricao: "",
        quantidade: "",
        valor: ""
    })

    const [hidePass, setHidePass] = useState(true)

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)


    async function sendToConfirm(data){
        console.log(data)
        Keyboard.dismiss()

        setDetailingData(data)

        modalizeRef.current?.open();              
    }

    function handleSend() {
       
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
        marginBottom: 40,
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
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20
    },
    labelError: {
        color: colors.red,
        marginLeft: 2
    },
})