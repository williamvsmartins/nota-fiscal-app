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
    description: yup.string().required("Digite uma descrição para seu produto/serviço."),
    unitaryValue: yup.string().test(
        'is-42',
        "Digite algum valor",
        (value) => value != "R$0,00",
      ).required("Digite o valor unitário do seu produto/serviço"),
    quantity: yup.number().min(0, "Insira a quantidade do seu produto/serviço").required("Insira a quantidade do seu produto/serviço")
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

    const [description, setDescription] = useState('') //final
    const [quantity, setQuantity] = useState(0) 
    const [unitValue, setUnitValue] = useState('0,00') //finall

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

        /*
        const dataFormatted = {
            cnpj: cnpjClient.replace(/([^\d])+/gim, ''),
            nome: nameClient,
            descricao: description,
            quantidade: String(quantity),
            valor: unitValue
        }*/
        try {
            setDetailingData(data)

            modalizeRef.current?.open();
           
            
            /*
            await apiNFC.post('login', {
                login: 'fake',
                senha: "fake",
                cnpj: "williamvaltherprogramador@gmail.com, williamvsmartins@gmail.com",
                descricao: description,
                quantidade: String(quantity),
                valor: unitValue
            });
            */
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
                                        Serviço
                                    </Text>
                                    <Text>
                                        {cnpjClient},
                                        {nameClient}
                                    </Text>
                                </View>
                                <Text style={styles.label}>CNPJ</Text>
                                <Controller
                                    control={control}
                                    name="description"
                                    render= {({ field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                        placeholderTextColor="#9a73ef"
                                        placeholder="Descrição do produto"
                                        style={styles.inputCNPJ}
                                        value={value}
                                        onChangeText={onChange}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="unitaryValue"
                                    render= {({ field: {onChange, onBlur, value}}) => (
                                        <TextInputMask 
                                            type='money'
                                            placeholderTextColor="#9a73ef"
                                            maxLength={11} //quantidade max de dígitos
                                            style={styles.inputCNPJ}
                                            value={String(value)}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                 {errors.unitaryValue && 
                                <Text style={styles.labelError}>{errors.unitaryValue?.message}</Text>
                                
                                }
                               
                               <Controller
                                    control={control}
                                    name="quantity"
                                    render= {({ field: {onChange, onBlur, value}}) => (
                                        <NumericInput 
                                            value={value} 
                                            onChange={onChange} 
                                            minValue={0}
                                            totalWidth={240} 
                                            totalHeight={50} 
                                            iconSize={25}
                                            step={1.5}
                                            valueType='integer'
                                            rounded 
                                            textColor='#B0228C' 
                                            rightButtonBackgroundColor='#EA3788' 
                                            leftButtonBackgroundColor='#E56B70'
                                        />
                                    )}
                                />
                                
                                
                                

                                <Text style={styles.label}>
                                    Total: R${total}
                                </Text>
                                <View style={styles.footer}>
                                    <ButtonConfirmation
                                        title="Confirmar"
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