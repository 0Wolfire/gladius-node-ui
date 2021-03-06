import { nameAction } from '../../../util/createAction';

const namespace = 'account';

export const SET_EMAIL_ADDRESS = nameAction(namespace, 'SET_EMAIL_ADDRESS');
export const SET_EMAIL_ADDRESS_SUCCESS = nameAction(namespace, 'SET_EMAIL_ADDRESS_SUCCESS');
export const SET_EMAIL_ADDRESS_FAILURE = nameAction(namespace, 'SET_EMAIL_ADDRESS_FAILURE');

export const SET_NAME = nameAction(namespace, 'SET_NAME');
export const SET_NAME_SUCCESS = nameAction(namespace, 'SET_NAME_SUCCESS');
export const SET_NAME_FAILURE = nameAction(namespace, 'SET_NAME_FAILURE');

export const SET_PASSPHRASE = nameAction(namespace, 'SET_PASSPHRASE');
export const SET_IP_ADDRESS = nameAction(namespace, 'SET_IP_ADDRESS');

export const SET_APPLY_POOL_LOADING = nameAction(namespace, 'SET_APPLY_POOL_LOADING');

export const API_APPLY_TO_POOL = nameAction(namespace, 'API_APPLY_TO_POOL');
export const API_SET_NODE_DATA = nameAction(namespace, 'API_SET_NODE_DATA');
