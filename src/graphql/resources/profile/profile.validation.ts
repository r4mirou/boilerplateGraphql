import * as yup from 'yup';

import customTypesInstance from '../../validation/schema-custom-types'

export default {
    updateCurrentProfile: {
        schema: yup.object().shape({
            input: yup.object({
                name: customTypesInstance.profileName.validation,
            })
        })
    },
}