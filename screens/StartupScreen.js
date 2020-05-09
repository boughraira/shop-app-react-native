import React,{useEffect} from 'react';
import {View,ActivityIndicator,StyleSheet,AsyncStorage} from 'react-native';
import {useDispatch} from 'react-redux'
import * as authActions from '../store/actions/auth'

import Colors from '../constants/Colors'

const StartupScreen=props=>{
    const dispatch=useDispatch()

    useEffect(()=>{
        const tryLogin=async()=>{
            const userData=await AsyncStorage.getItem('userData')
            if(!userData){
                props.navigation.navigate('Auth')
                return;
            }
            const tranformedData=JSON.parse(userData)
            const {token , userId, expiryDate}=tranformedData
            const expirationDate=new Date(expiryDate);

            if(expirationDate<= new Date() || !token || !userId){
                props.navigation.navigate('Auth')
                return;
            }
            props.navigation.navigate('Shop')
            dispatch(authActions.authenticate(userId,token))
        }

        tryLogin()
    },[dispatch])

    return(
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    )
}

const styles=StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default StartupScreen
