import * as yup from 'yup';

import customTypesInstance from '../../validation/schema-custom-types'

export default {
    template: {
        schema: yup.object({
            id: customTypesInstance.id.validation
        })
    },
    createTemplate: {
        schema: yup.object({
            input: yup.object({
                description: customTypesInstance.templateDescription.validation
            })
        })
    },
    updateTemplate: {
        schema: yup.object({
            id: customTypesInstance.id.validation,
            input: yup.object({
                description: customTypesInstance.templateDescription.validation
            })
        })
    },
    deleteTemplate: {
        schema: yup.object({
            id: customTypesInstance.id.validation
        })
    },
}