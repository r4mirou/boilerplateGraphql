import * as jwt from 'jsonwebtoken';
import {
    app,
    db,
    chai,
    handleError,
    expect,
    destroyAll
} from '../../test/test-utils';
import { UserInstance } from '../../src/models/UserModel';
import { JWT_SECRET } from '../../src/utils/utils';
import { TemplateInstance } from '../../src/models/*TemplateModel';

describe('Default - Fields Validations', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let userId: number;
    let token: string;

    let templateId: number;

    beforeEach(async () => {
        return await db.User.bulkCreate([
            {
                username: "user test1",
                email: 'teste1@email.com',
                password: '123456'
            }
        ], { returning: true })
            .then((user: UserInstance[]) => {
                userId = user[0].get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);
            }).then(() => db.Template.bulkCreate([
                {
                    fk_user: userId,
                    description: 'template 1'
                }
            ], { returning: true }))
            .then((template: TemplateInstance[]) => {
                templateId = template[0].get('id');
            });
    });

    afterEach(async () => {
        await destroyAll();
    });

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //-------------------------- VALIDATIONS  -------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Validations --

    //#region -- id --
    describe('id', () => {

        //#region -- Should return errors, trying to list the Template sending empty Id --

        it('Should return errors, trying to list the Template sending empty Id', () => {
            let body = {
                query: `
                        query findOneTemplate ($id: ID!) {
                            template (id: $id) {
                                id
                                description
                            }
                        }
                    `,
                variables: {
                    id: ''
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data.template).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`id`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo id não pode estar vazio.`);
                    expect(errors.message[1].fieldNameError).to.equal(`id`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo id não atinge o tamanho mínimo de 1 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return errors, trying to list the Template sending long Id --

        it('Should return errors, trying to list the Template sending long Id', () => {
            let body = {
                query: `
                        query findOneTemplate ($id: ID!) {
                            template (id: $id) {
                                id
                                description
                            }
                        }
                    `,
                variables: {
                    id: '1234567891234567891234567'
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data.template).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`id`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo id excede o tamanho limite de 24 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying to list Template sending null Id --

        it('Should return an error, trying to list Template sending null Id', () => {
            let body = {
                query: `
                        query findOneTemplate ($id: ID!) {
                            template (id: $id) {
                                id
                                description
                            }
                        }
                    `,
                variables: {
                    id: null
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$id" got invalid value`);
                }).catch(handleError);
        });

        //#endregion

    });
    //#endregion

    //#region -- username --
    describe('username', () => {

        //#region  -- Should return errors, trying to create User sending empty Username --

        it('Should return errors, trying to create User sending empty username', () => {

            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: '',
                        email: 'created@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`username`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo nome de usuário não pode estar vazio.`);
                    expect(errors.message[1].fieldNameError).to.equal(`username`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo nome de usuário não atinge o tamanho mínimo de 6 caracteres.`);

                }).catch(handleError);

        });

        //#endregion

        //#region  -- Should return an error, trying to create the User sending short Username --

        it('Should return an error, trying to create the User sending short Username', () => {

            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'user',
                        email: 'created@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`username`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo nome de usuário não atinge o tamanho mínimo de 6 caracteres.`);
                }).catch(handleError);

        });

        //#endregion

        //#region  -- Should return an error, trying to create the User sending long Username --

        it('Should return an error, trying to create the User sending long Username', () => {

            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'useruseruseruseruseruseruseruseruser',
                        email: 'created@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`username`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo nome de usuário excede o tamanho limite de 32 caracteres.`);
                }).catch(handleError);

        });

        //#endregion

        //#region  -- Should return an error, trying to create the User sending invalid format Username --

        it('Should return an error, trying to create the User sending invalid format Username', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'user test',
                        email: 'created@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`username`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo nome de usuário permite apenas caracteres alfanuméricos sem espaço.`);
                }).catch(handleError);

        });

        //#endregion

        //#region -- Should return an error, trying create User with null Username --

        it('Should return an error, trying create User with null Username', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: null,
                        email: 'created@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$input" got invalid value`);
                }).catch(handleError);
        });

        //#endregion

    });
    //#endregion

    //#region -- email -
    describe('email', () => {

        //#region -- Should return errors, trying to update the User sending empty Email --

        it('Should return errors, trying to update the User sending empty Email', () => {
            let body = {
                query: `
                        mutation createNewUser($input: UserCreateInput!) {
                            createUser(input: $input) {
                                id
                                username
                                email
                            }
                        }
                    `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: '',
                        password: '1234556'
                    }
                }
            };


            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`email`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo e-mail não pode estar vazio.`);
                    expect(errors.message[1].fieldNameError).to.equal(`email`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo e-mail não atinge o tamanho mínimo de 6 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return a error, trying to update the User sending short Email --

        it('Should return a error, trying to update the User sending short Email.', () => {
            let body = {
                query: `
                        mutation createNewUser($input: UserCreateInput!) {
                            createUser(input: $input) {
                                id
                                username
                                email
                            }
                        }
                    `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'e@.co',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`email`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo e-mail não atinge o tamanho mínimo de 6 caracteres.`);
                    expect(errors.message[1].fieldNameError).to.equal(`email`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo e-mail tem formato inválido.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return a error, trying to update the User sending long Email --

        it('Should return a error, trying to update the User sending long Email.', () => {
            let body = {
                query: `
                        mutation createNewUser($input: UserCreateInput!) {
                            createUser(input: $input) {
                                id
                                username
                                email
                            }
                        }
                    `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'updatedupdatedupdatedupdatedupdatedupdatedupdatedupdated@email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`email`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo e-mail excede o tamanho limite de 64 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return a error, trying to update the User sending invalid format Email --

        it('Should return a error, trying to update the User sending invalid format Email.', () => {
            let body = {
                query: `
                        mutation createNewUser($input: UserCreateInput!) {
                            createUser(input: $input) {
                                id
                                username
                                email
                            }
                        }
                    `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'updated email.com',
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`email`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo e-mail tem formato inválido.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying update User with null Email --

        it('Should return an error, trying create User with null Email', () => {
            let body = {
                query: `
                        mutation createNewUser($input: UserCreateInput!) {
                            createUser(input: $input) {
                                id
                                username
                                email
                            }
                        }
                    `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: null,
                        password: '1234556'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$input" got invalid value`);
                }).catch(handleError);
        });

        //#endregion

    });
    //#endregion

    //#region -- password --
    describe('password', () => {

        //#region -- Should return errors, trying to update the User sending empty Password --

        it('Should return errors, trying to update the User sending empty Email', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'test@email.com',
                        password: ''
                    }
                }
            };


            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`password`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo senha não pode estar vazio.`);
                    expect(errors.message[1].fieldNameError).to.equal(`password`);
                    expect(errors.message[1].fieldMessageError).to.equal(`O campo senha não atinge o tamanho mínimo de 6 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return a error, trying to update the User sending short Password --

        it('Should return a error, trying to update the User sending short Password.', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'test@email.com',
                        password: '123'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`password`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo senha não atinge o tamanho mínimo de 6 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return a error, trying to update the User sending long Password --

        it('Should return a error, trying to update the User sending long Password.', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'test@email.com',
                        password: '1234567891011'
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body.data).to.be.null;
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(errors.message).to.be.an('array');
                    expect(errors.message[0].fieldNameError).to.equal(`password`);
                    expect(errors.message[0].fieldMessageError).to.equal(`O campo senha excede o tamanho limite de 12 caracteres.`);
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying update User with null Password --

        it('Should return an error, trying create User with null Password', () => {
            let body = {
                query: `
                    mutation createNewUser($input: UserCreateInput!) {
                        createUser(input: $input) {
                            id
                            username
                            email
                        }
                    }
                `,
                variables: {
                    input: {
                        username: 'userTest',
                        email: 'created@email.com',
                        password: null
                    }
                }
            };

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$input" got invalid value`);
                }).catch(handleError);
        });

        //#endregion


    });
    //#endregion

    //#region -- login --
    describe('login', () => {

        //#region -- Should return errors, trying generate a new Token sending empty Login --

        it('Should return errors, tryng generate a new Token with empty Login', () => {

            let body = {
                query: `
                    mutation createNewToken($login: String!, $password: String!) {
                        createToken(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    login: '',
                    password: '123456'
                }
            }

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(res.body.data).to.be.key('createToken');
                    expect(res.body.data.createToken).to.be.null;
                    expect(res.body.errors).to.be.an('array').with.length(1);
                    expect(errors.message[0].fieldNameError).to.be.equal('login');
                    expect(errors.message[0].fieldMessageError).to.be.equal('O campo login não pode estar vazio.');
                    expect(errors.message[1].fieldNameError).to.be.equal('login');
                    expect(errors.message[1].fieldMessageError).to.be.equal('O campo login não atinge o tamanho mínimo de 6 caracteres.');
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying generate a new Token sending short Login --

        it('Should return an error, trying generate a new Token sending short Login', () => {

            let body = {
                query: `
                    mutation createNewToken($login: String!, $password: String!) {
                        createToken(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    login: 'abc',
                    password: '123456'
                }
            }

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(res.body.data).to.be.key('createToken');
                    expect(res.body.data.createToken).to.be.null;
                    expect(res.body.errors).to.be.an('array').with.length(1);
                    expect(errors.message[0].fieldNameError).to.be.equal('login');
                    expect(errors.message[0].fieldMessageError).to.be.equal('O campo login não atinge o tamanho mínimo de 6 caracteres.');
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying generate a new Token sending long Login --

        it('Should return an error, trying generate a new Token sending long Login', () => {
            let body = {
                query: `
                    mutation createNewToken($login: String!, $password: String!) {
                        createToken(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    login: 'updatedupdatedupdatedupdatedupdatedupdatedupdatedupdated@email.com',
                    password: '123456'
                }
            }

            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors[0];
                    expect(res.body).to.have.keys(['data', 'errors']);
                    expect(res.body.data).to.be.key('createToken');
                    expect(res.body.data.createToken).to.be.null;
                    expect(res.body.errors).to.be.an('array').with.length(1);
                    expect(errors.message[0].fieldNameError).to.be.equal('login');
                    expect(errors.message[0].fieldMessageError).to.be.equal('O campo login excede o tamanho limite de 64 caracteres.');
                }).catch(handleError);
        });

        //#endregion

        //#region -- Should return an error, trying generate a new Token sending null Login --

        it('Should return an error, trying generate a new Token sending null Login', () => {
            let body = {
                query: `
                    mutation createNewToken($login: String!, $password: String!) {
                        createToken(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    login: null,
                    password: '123456'
                }
            }


            return chai.request(app)
                .post('/graphql')
                .set('content-type', 'application/json')
                .send(JSON.stringify(body))
                .then(res => {
                    const errors = res.body.errors;
                    expect(res.body).to.have.keys(['errors']);
                    expect(errors).to.be.an('array');
                    expect(errors[0].message).to.contains(`Variable "$login" got invalid value`);
                }).catch(handleError);
        });

        //#endregion


    });
    //#endregion

    //#endregion

});