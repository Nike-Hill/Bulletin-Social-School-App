import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const CalendarScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>CalendarScreen</Text>
            <Button
                title="Click Here"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    )

}

export default CalendarScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
      justifyContent: 'center',
      alignItems: 'center',
    },


})