import React, { useReducer, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Button, TouchableOpacity, Platform } from 'react-native';
import colors from '../../constants/colors';
import { styles } from './styles';
import { useDispatch } from 'react-redux';
import { signUp, signIn } from '../../store/actions';
import { Input } from '../../components';
import { onInputChange, UPDATED_FORM } from '../../utils';

const initialState = {
    email: {value: '', error: '', touched: false, hasError: true},
    password: {value: '', error: '', touched: false, hasError: true},
    isFormValid: false,
  }

  const formReducer = (state, action) => {
    switch (action.type) {
      case UPDATED_FORM: 
        const {name, value, hasError, error, touched, isFormValid} = action.data
        return {
          ...state, 
          [name]: {
            ...state[name],
            value,
            hasError,
            error,
            touched
          },
          isFormValid
        };
      default: 
        return state;
    }
  }
const Auth = ({ navigation }) => {
  const dispatch = useDispatch()
  const [formState, dispatchFormState] = useReducer(formReducer, initialState);
  const [isLogin, setIsLogin] = useState(true);
  const title = isLogin ? 'Login' : 'Register';
  const message = isLogin ? "Don't you have an account?" : 'Do you have an account?'
  const messageAction = isLogin ? 'Login' : 'Register';
  const onHandlerSubmit = () => {
    dispatch(isLogin ? signIn(formState.email.value, formState.password.value) : signUp(formState.email.value, formState.password.value));
  };
  const onHandleChangeInput = (value, type) => {
    onInputChange(type, value, dispatchFormState, formState)
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'android'? 'height' : 'padding' } enabled>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
          <Input 
            label='Email'
            placeholder='enter your email'
            placeholderTextColor={colors.title}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(text)=>onHandleChangeInput(text, 'email')}
            value={formState.email.value}
            hasError={formState.email.hasError}
            error={formState.email.error}
            touched={formState.email.touched}
          />
          <Input 
            label="Password"
            placeholder='enter your password'
            placeholderTextColor={colors.title}
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(text)=>onHandleChangeInput(text, 'password')}
            value={formState.password.value}
            hasError={formState.password.hasError}
            error={formState.password.error}
            touched={formState.email.touched}

          />
          <Button 
            color={colors.primary}
            title={messageAction}
            disabled={!formState.isFormValid}
            onPress={onHandlerSubmit}
          />
          <View style={styles.prompt}>
            <TouchableOpacity style={styles.promptButton} onPress={()=>setIsLogin(!isLogin)}>
              <Text style={styles.promptMessage}>{message}</Text>
            </TouchableOpacity>
          </View>
      </View>
    </KeyboardAvoidingView>
      
  );
};

export default Auth;