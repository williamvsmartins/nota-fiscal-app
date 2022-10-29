import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";


import { ButtonConfirmation } from "./ButtonConfirmation";
import colors from "../styles/colors";

interface ClientConfirmationProps {
    data: {
        cnpj: String,
        nome: String
    }
}

export function ClientConfirmation({data, ...rest} : ClientConfirmationProps) {
    const navigator = useNavigation();
    return (
        <View style={styles.container}>
           <View style={styles.content}>
                <View style={styles.identification}>
                    <Text> {data.cnpj} </Text>
                    <Text> {data.nome}</Text>
                </View>
           </View>
            <ButtonConfirmation 
                title="Confirmar"
                onPress={() => navigator.navigate("NoteDetailing")}
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