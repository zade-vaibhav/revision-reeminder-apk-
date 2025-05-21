import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/styling'
import { colour, textColour } from '@/constants/theme'
import { typoProps } from '@/types'

const Typo = ({
    size,color=textColour.primary,fontWeight="400",children,styles,textProps={}
}:typoProps) => {
   const textStyle = {
    fontSize:size?verticalScale(size):verticalScale(18),
    fontWeight,
    color
   }
  return (
      <Text style={[styles,textStyle]} {...textProps}>{children}</Text>
  )
}

export default Typo

const styles = StyleSheet.create({})