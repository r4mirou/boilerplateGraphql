import { app, db, handleError, chai, expect, destroyAll } from "../../test-utils";

describe('Token - Resolvers', () => {

    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let validUsername = 'userTest1';
    let validEmail = 'teste1@email.com';
    let validPass = '123456';

    let invalidUsername = 'invalidUsername';
    let invalidEmail = 'invalid@email.com';
    let invalidPass = 'invalid12345';

    beforeEach(async () => {
        return await db.User.create(
            {
                username: 'userTest1',
                email: 'teste1@email.com',
                password: '123456'
            }
        );
    });

    afterEach(async () => {
        await destroyAll();
    });

    //#endregion


    ///////////////////////////////////////////////////////////////////////
    //--------------------------- MUTATIONS  --------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region  -- Mutations --

    describe('Mutations', () => {

        //#region  -- createToken --

        describe('createToken', () => {

            //#region -- Should return a new valid Token using Email for login --

            it('Should return a new valid Token using Email for login', () => {

                let body = {
                    query: `
                        mutation createNewToken($login: String!, $password: String!) {
                            createToken(login: $login, password: $password) {
                                token
                            }
                        }
                    `,
                    variables: {
                        login: validEmail,
                        password: validPass
                    }
                }

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data).to.be.key('createToken');
                        expect(res.body.data.createToken).to.have.key('token');
                        expect(res.body.data.createToken).to.be.string;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return a new valid Token using Username for login --

            it('Should return a new valid token using Username for login', () => {

                let body = {
                    query: `
                        mutation createNewToken($login: String!, $password: String!) {
                            createToken(login: $login, password: $password) {
                                token
                            }
                        }
                    `,
                    variables: {
                        login: validUsername,
                        password: validPass
                    }
                }

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data).to.be.key('createToken');
                        expect(res.body.data.createToken).to.have.key('token');
                        expect(res.body.data.createToken).to.be.string;
                        expect(res.body.errors).to.be.undefined;
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error if the Password is incorrect

            it('Should return an error if the Password is incorrect', () => {

                let body = {
                    query: `
                        mutation createNewToken($login: String!, $password: String!) {
                            createToken(login: $login, password: $password) {
                                token
                            }
                        }
                    `,
                    variables: {
                        login: validEmail,
                        password: invalidPass
                    }
                }

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(res.body.data).to.be.key('createToken');
                        expect(res.body.data.createToken).to.be.null;
                        expect(res.body.errors).to.be.an('array').with.length(1);
                        expect(res.body.errors[0].message).to.be.equal('Unauthorized, wrong email/username or password!');
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error if the Email is incorrect --

            it('Should return an error if the Email is incorrect', () => {

                let body = {
                    query: `
                        mutation createNewToken($login: String!, $password: String!) {
                            createToken(login: $login, password: $password) {
                                token
                            }
                        }
                    `,
                    variables: {
                        login: invalidEmail,
                        password: validPass
                    }
                }

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(res.body.data).to.be.key('createToken');
                        expect(res.body.data.createToken).to.be.null;
                        expect(res.body.errors).to.be.an('array').with.length(1);
                        expect(res.body.errors[0].message).to.be.equal('Unauthorized, wrong email/username or password!');
                    }).catch(handleError);
            });

            //#endregion

            //#region -- Should return an error if the Username is incorrect --

            it('Should return an error if the Username is incorrect', () => {

                let body = {
                    query: `
                        mutation createNewToken($login: String!, $password: String!) {
                            createToken(login: $login, password: $password) {
                                token
                            }
                        }
                    `,
                    variables: {
                        login: invalidUsername,
                        password: validPass
                    }
                }

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(res.body.data).to.be.key('createToken');
                        expect(res.body.data.createToken).to.be.null;
                        expect(res.body.errors).to.be.an('array').with.length(1);
                        expect(res.body.errors[0].message).to.be.equal('Unauthorized, wrong email/username or password!');
                    }).catch(handleError);
            });

            //#endregion

        });

        //#endregion

    });

    //#endregion


});