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

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';

import { TextInputMask } from "react-native-masked-text";
import NumericInput from 'react-native-numeric-input'




import { ButtonConfirmation } from "../components/ButtonConfirmation";

import { apiNFC }  from "../services/api";

import colors from "../styles/colors";

export function NoteDetailing(){

    const navigator = useNavigation()

    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [unitValue, setUnitValue] = useState('0,00')
    const [password, setPassword] = useState('')

    const [ total, setTotal] = useState(0)

    const [hidePass, setHidePass] = useState(true)

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    async function handleSubmit(){


        if(!description && password)
            return Alert.alert("Digite seu CNPJ e senha!")

        try {
           
            console.log(description)

            await apiNFC.post('login', {
                login: description,
                senha: password,
                cnpj: "williamvaltherprogramador@gmail.com, williamvsmartins@gmail.com",
                descricao: description,
                quantidade: String(quantity),
                valor: unitValue
            });

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
                                    Serviço
                                </Text>
                            </View>
                            <Text style={styles.label}>CNPJ</Text>
                            <TextInput
                                placeholderTextColor="#9a73ef"
                                placeholder="Descrição do produto"
                                style={styles.inputCNPJ}
                                value={description}
                                onChangeText={ text => setDescription(text)}
                            />
                            <TextInputMask 
                                type='money'
                                placeholderTextColor="#9a73ef"
                                maxLength={11} //quantidade max de dígitos
                                style={styles.inputCNPJ}
                                value={unitValue}
                                onChangeText={ value => {
                                        value = value.replace('R$', '');
                                        setUnitValue(value)
                                        value = value.replace('.', '');
                                        value = value.replace(',', '.');
                                        setTotal(Number(value) * quantity)
                                    }
                                    
                                }
                            />
                            <NumericInput 
                                value={quantity} 
                                onChange={ value => {
                                    setQuantity(value)
                                    setTotal(Number(unitValue.replace(',', '.')) * value)
                                }} 
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
                            

                            <Text style={styles.label}>
                                Total: R${total}
                            </Text>
                            <View style={styles.footer}>
                                <ButtonConfirmation
                                    title="Confirmar"
                                    disabled={!password}
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