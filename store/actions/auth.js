
import {AsyncStorage} from 'react-native'


export const LOGOUT='LOGOUT'
export const AUTHENTICATE='AUTHENTICATE'

export const authenticate=(userId,token)=>{
    return {type:AUTHENTICATE,userId:userId,token,token}
}

export const signup=(email,password)=>{

    return async dispatch=>{
       const response=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email:email,
                password:password,
                returnSecureToken:true
            })
        });

        if(!response.ok){
            const errorResData=await response.json();
            const errorId=errorResData.error.message;
            let message ='Something Went Wrong';
            if(errorId==='EMAIL_EXISTS'){
                message='This Email exists already!!'
            }else if(errorId==='INVALID_PASSWORD'){
                message='This Password is not valid!'
            }
            throw new Error(message)
        }
         const resData=await response.json();
         console.log(resData)
        dispatch(authenticate(resData.localId,resData.idToken))
        const expirationDate=new Date(
            new Date().getTime() + parseInt(resData.expiresIn)*1000
        )
        saveDataStorage(resData.idToken,resData.localId,expirationDate)
    }
}

export const login=(email,password)=>{

    return async dispatch=>{
       const response=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email:email,
                password:password,
                returnSecureToken:true
            })
        });

        if(!response.ok){
            const errorResData=await response.json();
            const errorId=errorResData.error.message;
            let message ='Something Went Wrong';
            if(errorId==='EMAIL_NOT_FOUND'){
                message='This Email could not be found!'
            }else if(errorId==='INVALID_PASSWORD'){
                message='This Password is not valid!'
            }
            throw new Error(message)
        }
         const resData=await response.json();
         console.log(resData)
         dispatch(authenticate(resData.localId,resData.idToken))
         const expirationDate=new Date(
            new Date().getTime() + parseInt(resData.expiresIn)*1000
        )
        saveDataStorage(resData.idToken,resData.localId,expirationDate)
    }
}

export const logout=()=>{
    return{type:LOGOUT}
} 

const saveDataStorage=(token,userId,expirationDate)=>{
    AsyncStorage.setItem('userData',JSON.stringify({
        token:token,
        userId:userId,
        expiryDate:expirationDate.toISOString()
    }))
}
