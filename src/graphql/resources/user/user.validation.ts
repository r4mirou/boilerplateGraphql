import * as yup from 'yup';

import customTypesInstance from '../../validation/schema-custom-types'

export default {
    createUser: {
        schema: yup.object({
            input: yup.object({
                username: customTypesInstance.username.validation,
                email: customTypesInstance.email.validation,
                password: customTypesInstance.password.validation,
            })
        })
    },
    updateCurrentUser: {
        schema: yup.object({
            input: yup.object({
                username: customTypesInstance.username.validation,
                email: customTypesInstance.email.validation
            })
        })
    },
    updateCurrentUserPassword: {
        schema: yup.object({
            input: yup.object({
                password: customTypesInstance.password.validation,
            })
        })
    }
}