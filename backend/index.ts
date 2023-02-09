import axios from 'axios';
import { UTxO } from '@meshsdk/core';

const instance = axios.create({
    baseURL: `/api/`,
    withCredentials: true,
});

export function post(route: string, body = {}){
    return instance
        .post(`${route}`, body)
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            throw error;
    });
}

export async function createTransaction(
    recipientAddress: string,
    utxos: UTxO[]
) {
    return await post(`create-minting-transaction`, { recipientAddress, utxos })
}