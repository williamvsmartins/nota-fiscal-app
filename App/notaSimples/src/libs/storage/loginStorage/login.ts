import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaveLogin, GetLogin, Login } from './types';

const getLoginStorage: GetLogin = async () => {
    const login = await AsyncStorage.getItem('@notaSimples:login');
  
    if (!login) {
      return {};
    }
  
    return JSON.parse(login)
}

const saveLoginStorage: SaveLogin = async (login: Login) => {
    await AsyncStorage.setItem('@notaSimples:login', JSON.stringify(login));
}

export {
    getLoginStorage,
    saveLoginStorage,
}
  