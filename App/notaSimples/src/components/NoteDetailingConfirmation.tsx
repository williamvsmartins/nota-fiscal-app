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
        cnpjClient: string,
        description: string,
        nameClient: string,
        quantity: 0,
        unitaryValue: string
    }
}

export function NoteDetailingConfirmation({data, ...rest} : NoteDetailingConfirmationProps) {
    
    var unitary = data.unitaryValue.replace(",", ".").replace("R$", "")
    var total = Number(unitary) * data.quantity
    var totalFormatted = total.toFixed(2).replace(".", ",")

    return (
        <View style={styles.container}>
           <View style={styles.content}>

                <View style={styles.productSummary}>
                    <Text style={styles.summaryText}>
                        {data.quantity}x {'\n'}
                        {data.unitaryValue} {'\n'} 
                        {data.description}
                    </Text>
                </View>
                <View style={styles.valueTotal}>
                    <Text style={styles.valueTitle}>Total</Text>
                    <Text style={styles.value}>R${totalFormatted}</Text>
                </View>
               
           </View>

            
                    
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
        width: '100%',
        alignItems: 'center'
    },
    valueTotal: {
        marginHorizontal: 20,
        justifyContent: 'center',
        width: '50%',
        height: 130,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: colors.purple
    },
    valueTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.white,
    },
    value: {
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 2,
        fontSize: 42,
        fontWeight: 'bold',
        color: '#32cd32',
    },
    productSummary: {
        marginHorizontal: 20,
        marginTop: 20,
        height: 300
    },
    summaryText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold",
        color: colors.purple
    }
})