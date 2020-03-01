import * as yup from 'yup';

import customTypesInstance from '../../validation/schema-custom-types'

export default {
    createToken: {
        schema: yup.object({
            login: customTypesInstance.login.validation,
            password: customTypesInstance.password.validation,
        })
    }
}