import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary;
    const outlinedColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.white : COLORS.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: COLORS.whites},
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontWeight:800, fontSize: 20, ... { color: COLORS.white } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        width:50,
        weight: 100,
        borderWidth: 1,
        borderShadow:1,
        elevation:1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button