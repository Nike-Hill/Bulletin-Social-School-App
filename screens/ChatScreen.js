import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const ChatScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>ChatScreen</Text>
            <Button
                title="Click Here"
                onPress={() => alert('Button Clicked!')}
            />
        </View>
    )

}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
      justifyContent: 'center',
      alignItems: 'center',
    },


})