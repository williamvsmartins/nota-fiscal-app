import React, {useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { ButtonConfirmation } from "./ButtonConfirmation";
import colors from "../styles/colors";

import { Entypo } from '@expo/vector-icons'; 

interface ClientConfirmationProps {
    data: {
        cnpj: String,
        nome: String,
        logradouro: string,
        numero: string,
        bairro: string,
        municipio: string,
        uf: string,
        tipo: string,
        telefone: string,
        capital_social: string,
        abertura: string,
        atividade_principal: [{
            text: string,
            code: string
        }],
        situacao: string
    }
}

export function ClientConfirmation({data, ...rest} : ClientConfirmationProps) {

   
    return (
        <View style={styles.container}>
           <View style={styles.content}>
                <View style={styles.identification}>
                    <Text style={styles.cnpj}> {data.cnpj}</Text>
                    <Text style={styles.nome}> {data.nome}</Text>
                    <View style={styles.addressSpace}>
                        <Entypo 
                            name="location-pin"
                            size={30}
                            color={colors.gray} />
                        <Text
                            style={styles.endereco}
                        > 
                            {data.logradouro}, {data.numero}, {data.bairro}{'\n'}
                            {data.municipio} - {data.uf}
                        </Text>
                    </View>
                   
                </View>
                
                <View style={styles.information}>
                    <View 
                        style={[styles.card,{backgroundColor: '#ee9b9e57'}]}>
                        <Entypo
                            name="home" 
                            size={24} 
                            color="#f08080" 
                        />
                        <Text 
                            style={styles.cardTitle}
                        >
                            Tipo
                        </Text>
                        <Text 
                            style={{
                                color:"#f08080", 
                                fontWeight: 'bold'
                            }}
                        >
                            {data.tipo}
                        </Text>
                    </View>

                    <View style={[styles.card, {backgroundColor: '#d4bf5c33'}]}>
                        <Entypo 
                            name="phone"
                            size={24} 
                            color="#d4bf5e" 
                        />
                        <Text style={styles.cardTitle}>
                            Telefone
                        </Text>
                        <Text 
                            style={{
                                color:"#d4bf5e", 
                                fontWeight: 'bold'
                                }}
                        >
                            {data.telefone}
                        </Text>
                    </View>

                    <View style={[styles.card, 
                        {backgroundColor: '#5dd58357'
                    }]}
                    >
                        <Entypo 
                            name="credit" 
                            size={24} 
                            color="#5dd55d" 
                        />
                        <Text style={styles.cardTitle}>
                            Capital social
                        </Text>
                        <Text style={{color:"#5dd55d", 
                            fontWeight: 'bold'
                            }}
                        >
                            R$ {data.capital_social}
                        </Text>
                    </View>
                </View>

                <View style={styles.overview}>
                    <Text style={styles.overviewTitle}>Visão Geral</Text>
                    <Text style={styles.overviewSubTitle}>
                        Empresa de {data.municipio}, {data.uf}, {'\n'}
                        fundada em {data.abertura}. {'\n'}
                        Sua atividade principal é 
                        <Text style={{color: colors.purple, marginRight: 5}}> {data.atividade_principal[0].text}</Text>
                    </Text>
                    <Text style={styles.situationTitle}>
                        Situação
                    </Text>
                    <View style={styles.situation}>
                        <Text style={styles.situationText}>{data.situacao}</Text>
                     </View>
                   
                </View>

           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    content: {
        width: '100%',
    },
    identification: {
        alignItems: 'center',
        marginHorizontal: 20
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
    addressSpace:{
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 10
    },
    endereco: {
        marginRight: 30,
        fontSize: 15,
        fontWeight: "bold",
        textAlign: 'center',
        color: colors.gray_dark,
    },
    information: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 59
    },
    card: {
        width: '28%',
        height: 120,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.gray_dark,
        marginVertical: 15
    },
    overview: {
        width: '100%',
        marginHorizontal: 13,
        paddingRight: 10,
    },
    overviewTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.purple,
    },
    overviewSubTitle: {
        flex: 1,
        lineHeight: 28,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.gray_dark,
        height: 190
    },
    situation: {
        width: '95%',
        height: 65,
        backgroundColor: '#5dd58357',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    situationTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.purple,
    },
    situationText: {
        fontSize: 30,
        color: '#5dd55d'
    }
})