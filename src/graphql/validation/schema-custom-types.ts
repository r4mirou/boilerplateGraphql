import * as yup from 'yup';
import schemaMessagesInstance from '../validation/schema-messages';

class CustomTypes {
    static customTypesInstance: CustomTypes;

    constructor() {
        if (!CustomTypes.customTypesInstance) {
            CustomTypes.customTypesInstance = this;
        }
        return CustomTypes.customTypesInstance;
    }

    //#region -- Default --

    id = {
        validation: yup.string()
            .required(schemaMessagesInstance.defaulted.id.required)
            .min(1, schemaMessagesInstance.defaulted.id.min)
            .max(24, schemaMessagesInstance.defaulted.id.max)
    }
    email = {
        validation: yup.string()
            .required(schemaMessagesInstance.defaulted.email.required)
            .min(6, schemaMessagesInstance.defaulted.email.min)
            .max(64, schemaMessagesInstance.defaulted.email.max)
            .email(schemaMessagesInstance.defaulted.email.email)
    }
    username = {
        validation: yup.string()
            .required(schemaMessagesInstance.defaulted.username.required)
            .min(6, schemaMessagesInstance.defaulted.username.min)
            .max(32, schemaMessagesInstance.defaulted.username.max)
            .matches(/^[a-zA-Z0-9]*$/, schemaMessagesInstance.defaulted.username.alphanum)
    }
    password = {
        validation: yup.string()
            .required(schemaMessagesInstance.defaulted.password.required)
            .min(6, schemaMessagesInstance.defaulted.password.min)
            .max(12, schemaMessagesInstance.defaulted.password.max)
    }
    login = {
        validation: yup.string()
            .required(schemaMessagesInstance.defaulted.login.required)
            .min(6, schemaMessagesInstance.defaulted.login.min)
            .max(64, schemaMessagesInstance.defaulted.login.max)
    }

    //#endregion

    //#region -- Profile --

    profileName = {
        validation: yup.string()
            .required(schemaMessagesInstance.profile.name.required)
            .min(1, schemaMessagesInstance.profile.name.min)
            .max(64, schemaMessagesInstance.profile.name.max)
    }

    //#endregion

    //#region -- Template --

    templateDescription = {
        validation: yup.string()
            .required(schemaMessagesInstance.template.description.required)
            .min(1, schemaMessagesInstance.template.description.min)
            .max(512, schemaMessagesInstance.template.description.max)
    }

    //#endregion

}

const customTypesInstance: CustomTypes = new CustomTypes();
Object.freeze(customTypesInstance);
export default customTypesInstance;








// import * as yup from 'yup';
// import {
//     defaulted,
//     profile,
//     template
// } from '../validation/schema-messages';


// //#region -- Default --

// const id = {
//     validation: yup.string()
//         .required(defaulted.id.required)
//         .min(1, defaulted.id.min)
//         .max(24, defaulted.id.max)
// }
// const email = {
//     validation: yup.string()
//         .required(defaulted.email.required)
//         .min(6, defaulted.email.min)
//         .max(64, defaulted.email.max)
//         .email(defaulted.email.email)
// }
// const username = {
//     validation: yup.string()
//         .required(defaulted.username.required)
//         .min(6, defaulted.username.min)
//         .max(32, defaulted.username.max)
//         .matches(/^[a-zA-Z0-9]*$/, defaulted.username.alphanum)
// }
// const password = {
//     validation: yup.string()
//         .required(defaulted.password.required)
//         .min(6, defaulted.password.min)
//         .max(12, defaulted.password.max)
// }
// const login = {
//     validation: yup.string()
//         .required(defaulted.login.required)
//         .min(6, defaulted.login.min)
//         .max(64, defaulted.login.max)
// }

// //#endregion

// //#region -- Profile --

// const profileName = {
//     validation: yup.string()
//         .required(profile.name.required)
//         .min(1, profile.name.min)
//         .max(64, profile.name.max)
// }

// //#endregion

// //#region -- Template --

// const templateDescription = {
//     validation: yup.string()
//         .required(template.description.required)
//         .min(1, template.description.min)
//         .max(512, template.description.max)
// }

// //#endregion

// export {
//     email,
//     username,
//     password,
//     login,
//     id,
//     profileName,
//     templateDescription
// };




// import * as yup from 'yup';
// import instance from '../validation/schema-messages';


// //#region -- Default --

// const id = {
//     validation: yup.string()
//         .required(instance.defaulted.id.required)
//         .min(1, instance.defaulted.id.min)
//         .max(24, instance.defaulted.id.max)
// }
// const email = {
//     validation: yup.string()
//         .required(instance.defaulted.email.required)
//         .min(6, instance.defaulted.email.min)
//         .max(64, instance.defaulted.email.max)
//         .email(instance.defaulted.email.email)
// }
// const username = {
//     validation: yup.string()
//         .required(instance.defaulted.username.required)
//         .min(6, instance.defaulted.username.min)
//         .max(32, instance.defaulted.username.max)
//         .matches(/^[a-zA-Z0-9]*$/, instance.defaulted.username.alphanum)
// }
// const password = {
//     validation: yup.string()
//         .required(instance.defaulted.password.required)
//         .min(6, instance.defaulted.password.min)
//         .max(12, instance.defaulted.password.max)
// }
// const login = {
//     validation: yup.string()
//         .required(instance.defaulted.login.required)
//         .min(6, instance.defaulted.login.min)
//         .max(64, instance.defaulted.login.max)
// }

// //#endregion

// //#region -- Profile --

// const profileName = {
//     validation: yup.string()
//         .required(instance.profile.name.required)
//         .min(1, instance.profile.name.min)
//         .max(64, instance.profile.name.max)
// }

// //#endregion

// //#region -- Template --

// const templateDescription = {
//     validation: yup.string()
//         .required(instance.template.description.required)
//         .min(1, instance.template.description.min)
//         .max(512, instance.template.description.max)
// }

// //#endregion

// export {
//     email,
//     username,
//     password,
//     login,
//     id,
//     profileName,
//     templateDescription
// };