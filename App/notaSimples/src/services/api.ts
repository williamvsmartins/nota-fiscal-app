import axios from 'axios';
import { API_NFC, QUERY_CNPJ } from '@env'

export const apiNFC = axios.create({
    baseURL: `${API_NFC}`
});

export const queryCNPJ = axios.create({
    baseURL: `${QUERY_CNPJ}`
});