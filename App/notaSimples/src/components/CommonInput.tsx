import React, { useState } from "react";
import { 
    Text,
    StyleSheet,
    TextInput
} from "react-native";

export function CommonInput(){
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    
    return (
        <TextInput
        style={[styles.input]}
        placeholder="Digite seu CNPJ"
        />
    )
}

const styles = StyleSheet.create({
    input: {

    }
})