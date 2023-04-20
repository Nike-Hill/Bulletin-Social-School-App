import React from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';

import { RoundedBox, BoldText, BoldTextBig } from '../styles/RoleDisplayStyles';

const RoleDisplay = ({item, size}) => {
    console.log("sizevariable is ", size?.size);

    return (
        <RoundedBox>
            {size?.size==="0" && (<>
                <BoldText>{item.emoji}</BoldText>
                <BoldText>{item.name}</BoldText>
            </>)}

            {size?.size==="1" && (<>
                <BoldTextBig>{item.emoji}</BoldTextBig>
                <BoldTextBig>{item.name}</BoldTextBig>
            </>)}
        </RoundedBox>
    );
};


export default RoleDisplay;