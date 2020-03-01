class SchemaMessages {
    static schemaMessagesInstance: SchemaMessages;

    constructor() {
        if (!SchemaMessages.schemaMessagesInstance) {
            SchemaMessages.schemaMessagesInstance = this;
        }
        return SchemaMessages.schemaMessagesInstance;
    }

    composeMessage(method: string, fieldName: string, fieldNameShow: string, lenght?: number) {

        var fieldMessage, composeFieldName, result;

        switch (method) {
            case 'required':
                composeFieldName = `|${fieldName}`
                fieldMessage = `O campo ${fieldNameShow} não pode estar vazio.`
                result = fieldMessage + composeFieldName
                break
            case 'min':
                composeFieldName = `|${fieldName}`
                fieldMessage = `O campo ${fieldNameShow} não atinge o tamanho mínimo de ${lenght} caracteres.`
                result = fieldMessage + composeFieldName
                break
            case 'max':
                composeFieldName = `|${fieldName}`
                fieldMessage = `O campo ${fieldNameShow} excede o tamanho limite de ${lenght} caracteres.`
                result = fieldMessage + composeFieldName
                break
            case 'alphanum':
                composeFieldName = `|${fieldName}`
                fieldMessage = `O campo ${fieldNameShow} permite apenas caracteres alfanuméricos sem espaço.`
                result = fieldMessage + composeFieldName
                break
            case 'email':
                composeFieldName = `|${fieldName}`
                fieldMessage = `O campo ${fieldNameShow} tem formato inválido.`
                result = fieldMessage + composeFieldName
                break
            default:
                result = 'Erro de validação sem mensagem cadastrada'
        }
        return result;
    }

    defaulted = {
        id: {
            required: this.composeMessage('required', 'id', 'id'),
            min: ({ min }) => (this.composeMessage('min', 'id', 'id', min)),
            max: ({ max }) => (this.composeMessage('max', 'id', 'id', max)),
        },
        email: {
            required: this.composeMessage('required', 'email', 'e-mail'),
            min: ({ min }) => (this.composeMessage('min', 'email', 'e-mail', min)),
            max: ({ max }) => (this.composeMessage('max', 'email', 'e-mail', max)),
            email: this.composeMessage('email', 'email', 'e-mail'),
        },
        username: {
            required: this.composeMessage('required', 'username', 'nome de usuário'),
            min: ({ min }) => (this.composeMessage('min', 'username', 'nome de usuário', min)),
            max: ({ max }) => (this.composeMessage('max', 'username', 'nome de usuário', max)),
            alphanum: this.composeMessage('alphanum', 'username', 'nome de usuário'),
        },
        password: {
            required: this.composeMessage('required', 'password', 'senha'),
            min: ({ min }) => (this.composeMessage('min', 'password', 'senha', min)),
            max: ({ max }) => (this.composeMessage('max', 'password', 'senha', max)),
        },
        //login = usuario ou senha
        login: {
            required: this.composeMessage('required', 'login', 'login'),
            min: ({ min }) => (this.composeMessage('min', 'login', 'login', min)),
            max: ({ max }) => (this.composeMessage('max', 'login', 'login', max)),
            alphanum: this.composeMessage('alphanum', 'login', 'login'),
        }
    }

    profile = {
        name: {
            required: this.composeMessage('required', 'name', 'nome'),
            min: ({ min }) => (this.composeMessage('min', 'name', 'nome', min)),
            max: ({ max }) => (this.composeMessage('max', 'name', 'nome', max)),
        }
    }

    template = {
        description: {
            required: this.composeMessage('required', 'description', 'descrição'),
            min: ({ min }) => (this.composeMessage('min', 'description', 'descrição', min)),
            max: ({ max }) => (this.composeMessage('max', 'description', 'descrição', max)),
        }
    }

    token = {}
    user = {}
}

const schemaMessagesInstance: SchemaMessages = new SchemaMessages();
Object.freeze(schemaMessagesInstance);
export default schemaMessagesInstance;






// const templateMessage = (method: string, fieldName: string, fieldNameShow: string, lenght?: number) => {

//     var fieldMessage, composeFieldName, result;

//     switch (method) {
//         case 'required':
//             composeFieldName = `|${fieldName}`
//             fieldMessage = `O campo ${fieldNameShow} não pode estar vazio.`
//             result = fieldMessage + composeFieldName
//             break
//         case 'min':
//             composeFieldName = `|${fieldName}`
//             fieldMessage = `O campo ${fieldNameShow} não atinge o tamanho mínimo de ${lenght} caracteres.`
//             result = fieldMessage + composeFieldName
//             break
//         case 'max':
//             composeFieldName = `|${fieldName}`
//             fieldMessage = `O campo ${fieldNameShow} excede o tamanho limite de ${lenght} caracteres.`
//             result = fieldMessage + composeFieldName
//             break
//         case 'alphanum':
//             composeFieldName = `|${fieldName}`
//             fieldMessage = `O campo ${fieldNameShow} permite apenas caracteres alfanuméricos sem espaço.`
//             result = fieldMessage + composeFieldName
//             break
//         case 'email':
//             composeFieldName = `|${fieldName}`
//             fieldMessage = `O campo ${fieldNameShow} tem formato inválido.`
//             result = fieldMessage + composeFieldName
//             break
//         default:
//             result = 'Erro de validação sem mensagem cadastrada'
//     }
//     return result;
// }

// export const defaulted = {
//     id: {
//         required: templateMessage('required', 'id', 'id'),
//         min: ({ min }) => (templateMessage('min', 'id', 'id', min)),
//         max: ({ max }) => (templateMessage('max', 'id', 'id', max)),
//     },
//     email: {
//         required: templateMessage('required', 'email', 'e-mail'),
//         min: ({ min }) => (templateMessage('min', 'email', 'e-mail', min)),
//         max: ({ max }) => (templateMessage('max', 'email', 'e-mail', max)),
//         email: templateMessage('email', 'email', 'e-mail'),
//     },
//     username: {
//         required: templateMessage('required', 'username', 'nome de usuário'),
//         min: ({ min }) => (templateMessage('min', 'username', 'nome de usuário', min)),
//         max: ({ max }) => (templateMessage('max', 'username', 'nome de usuário', max)),
//         alphanum: templateMessage('alphanum', 'username', 'nome de usuário'),
//     },
//     password: {
//         required: templateMessage('required', 'password', 'senha'),
//         min: ({ min }) => (templateMessage('min', 'password', 'senha', min)),
//         max: ({ max }) => (templateMessage('max', 'password', 'senha', max)),
//     },
//     //login = usuario ou senha
//     login: {
//         required: templateMessage('required', 'login', 'login'),
//         min: ({ min }) => (templateMessage('min', 'login', 'login', min)),
//         max: ({ max }) => (templateMessage('max', 'login', 'login', max)),
//         alphanum: templateMessage('alphanum', 'login', 'login'),
//     }
// }

// export const profile = {
//     name: {
//         required: templateMessage('required', 'name', 'nome'),
//         min: ({ min }) => (templateMessage('min', 'name', 'nome', min)),
//         max: ({ max }) => (templateMessage('max', 'name', 'nome', max)),
//     }
// }

// export const template = {
//     description: {
//         required: templateMessage('required', 'description', 'descrição'),
//         min: ({ min }) => (templateMessage('min', 'description', 'descrição', min)),
//         max: ({ max }) => (templateMessage('max', 'description', 'descrição', max)),
//     }
// }

// export const token = {}
// export const user = {}
