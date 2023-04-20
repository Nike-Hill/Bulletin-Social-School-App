import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export const RoundedBox = styled.View`
    background-color: #d9dbda;
    border-radius: 20px;
    border-width: 2px;
    border-color: #C0C0C0;
    padding: 6px;
    margin-top: 1px;
    margin-bottom: 1px;
    margin-horizontal: 3px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const BoldText = styled.Text`
    font-weight: 500;
    font-size: 11px;
`;


export const BoldTextBig = styled.Text`
    font-weight: 500;
    font-size: 18px;
`;
