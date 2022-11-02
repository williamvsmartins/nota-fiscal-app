import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";


import { ButtonConfirmation } from "./ButtonConfirmation";
import colors from "../styles/colors";

interface NoteDetailingConfirmationProps {
    data: {
        cnpj: string,
        nome: string,
        descricao: string,
        quantidade: string,
        valor: string
    }
}

export function NoteDetailingConfirmation({data, ...rest} : NoteDetailingConfirmationProps) {

    const navigator = useNavigation();
    function handleClient() {
        navigator.navigate('NoteDetailing', {
            cnpj: data.cnpj,
        })
    }
    return (
        <View style={styles.container}>
           <View style={styles.content}>
                <View style={styles.identification}>
                    <Text> {data.cnpj} </Text>
                    <Text> {data.nome} </Text>
                    <Text> {data.descricao} </Text>
                    <Text> {data.quantidade} </Text>
                </View>
           </View>

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
            />
                    
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {

    },
    identification: {

    }
})