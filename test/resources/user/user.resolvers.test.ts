import * as jwt from 'jsonwebtoken';

import { app, db, chai, handleError, expect, destroyAll } from './../../test-utils';
import { UserInstance } from '../../../src/models/UserModel';
import { JWT_SECRET } from '../../../src/utils/utils';

describe('User - Resolvers', () => {



    ///////////////////////////////////////////////////////////////////////
    //----------------------------- INIT  ------------------------------ //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Initial Load --

    let userId: number;
    let token: string;

    let temporaryUserId: number;
    let temporaryUserToken: string;

    let withoutProfileUserId: number;
    let withoutProfileUserToken: string;

    beforeEach(async () => {
        return await db.User.bulkCreate([
            {
                username: "user test1",
                email: 'teste1@email.com',
                password: '12345'
            },
            {
                username: "user test2",
                email: 'teste2@email.com',
                password: '12345'
            },
            {
                username: "user test3",
                email: 'teste3@email.com',
                password: '12345'
            }
        ], { returning: true })
            .then((user: UserInstance[]) => {
                userId = user[0].get('id');
                const payload = { sub: userId };
                token = jwt.sign(payload, JWT_SECRET);

                temporaryUserId = user[1].get('id');
                const unauthorizedPayload = { sub: temporaryUserId };
                temporaryUserToken = jwt.sign(unauthorizedPayload, JWT_SECRET);

                withoutProfileUserId = user[2].get('id');
                const withoutProfilePayload = { sub: withoutProfileUserId };
                withoutProfileUserToken = jwt.sign(withoutProfilePayload, JWT_SECRET);
            })
            .then(() => {
                db.User.destroy({
                    where: {
                        username: "user test2"
                    }
                })
            })
            .then(() => db.Profile.create(
                {
                    name: "profile test",
                    fk_user: userId,
                }, { returning: true }))
    });

    afterEach(async () => {
        await destroyAll();
    })


    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //---------------------------- QUERIES  ---------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region -- Queries --

    describe('Queries', () => {

        //#region -- currentUser --

        describe('currentUser', () => {

            //#region -- Should return the current User by Token --

            it('Should return the current User by Token', () => {
                let body = {
                    query: `
                        query {
                            currentUser{
                                id
                                username
                                email
                            }
                        }
                    `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const singleUser = res.body.data.currentUser;
                        expect(res.body.data).to.be.an('object');
                        expect(singleUser).to.be.an('object');
                        expect(singleUser).to.have.keys(['id', 'username', 'email']);
                        expect(singleUser.username).to.equal('user test1');
                        expect(singleUser.email).to.equal('teste1@email.com');
                    }).catch(handleError);

            });

            //#endregion

            //#region -- Should return an error, trying to get the User of an nonexistent User --

            it('Should return an error, trying to get the User of an nonexistent User', () => {
                let body = {
                    query: `
                    query {
                        currentUser{
                            id
                            username
                            email
                        }
                    }
                `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.currentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Cannot read property 'id' of undefined`);
                    }).catch(handleError);

            });

            //#endregion

        });

        //#endregion

    });

    //#endregion



    ///////////////////////////////////////////////////////////////////////
    //--------------------------- MUTATIONS  --------------------------- //
    ///////////////////////////////////////////////////////////////////////
    //#region  -- Mutations --

    describe('Mutations', () => {

        //#region -- createUser --

        describe('createUser', () => {

            //#region  -- Should create a new User --

            it('Should create a new User', () => {

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
                            username: "userCreated",
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
                        const createdUser = res.body.data.createUser;
                        expect(createdUser).to.be.an('object');
                        expect(createdUser.username).to.equal('userCreated');
                        expect(createdUser.email).to.equal('created@email.com');
                        expect(parseInt(createdUser.id)).to.be.a('number');

                    }).catch(handleError);

            });

            //#endregion

        });

        //#endregion

        //#region -- updateCurrentUser --

        describe('updateCurrentUser', () => {

            //#region -- Should update an existing User --

            it('Should update an existing User', () => {
                let body = {
                    query: `
                            mutation updateExistingUser($input: UserUpdateInput!) {
                                updateCurrentUser(input: $input) {
                                    username
                                    email
                                }
                            }
                        `,
                    variables: {
                        input: {
                            username: "userUpdated",
                            email: 'updated@email.com',
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const updatedUser = res.body.data.updateCurrentUser;
                        expect(updatedUser).to.be.an('object');
                        expect(updatedUser.username).to.equal('userUpdated');
                        expect(updatedUser.email).to.equal('updated@email.com');
                        expect(updatedUser.id).to.be.undefined;
                    }).catch(handleError);

            });

            //#endregion

            //#region  -- Should return an error, trying to update the User of an nonexistent User --

            it('Should return an error, trying to update the User of an nonexistent User', () => {
                let body = {
                    query: `
                            mutation updateExistingUser($input: UserUpdateInput!) {
                                updateCurrentUser(input: $input) {
                                    username
                                    email
                                }
                            }
                        `,
                    variables: {
                        input: {
                            username: "userUpdated",
                            email: 'updated@email.com',
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.updateCurrentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`TypeError: Cannot read property 'id' of undefined`);
                    }).catch(handleError);
            });

            //#endregion
        });

        //#endregion

        //#region -- updateCurrentUserPassword --

        describe('updateCurrentUserPassword', () => {

            //#region  -- Should update the Password of an existing User --

            it('Should update the Password of an existing User', () => {

                let body = {
                    query: `
                            mutation updateUserPassword($input: UserUpdatePasswordInput!) {
                                updateCurrentUserPassword(input: $input)
                            }
                        `,
                    variables: {
                        input: {
                            password: "newPass123",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data.updateCurrentUserPassword).to.be.true;
                    }).catch(handleError);

            });

            //#endregion

            //#region  -- Should return an error, trying to update the Password of an nonexistent User --

            it('Should return an error, trying to update the Password of an nonexistent User', () => {

                let body = {
                    query: `
                            mutation updateUserPassword($input: UserUpdatePasswordInput!) {
                                updateCurrentUserPassword(input: $input)
                            }
                        `,
                    variables: {
                        input: {
                            password: "newPass123",
                        }
                    }
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.updateCurrentUserPassword).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`TypeError: Cannot read property 'id' of undefined`);
                    }).catch(handleError);

            });

            //#endregion

        });

        //#endregion

        //#region -- deleteCurrentUser --

        describe('deleteCurrentUser', () => {

            //#region -- Should delete an existing User --

            it('Should delete an existing User', () => {

                let body = {
                    query: `
                            mutation {
                                deleteCurrentUser
                            }
                        `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        expect(res.body.data.deleteCurrentUser).to.be.true;
                    }).catch(handleError);

            });

            //#endregion

            //#region  -- Should return an error, trying to delete the current User without a associated Profile --

            it('Should return an error, trying to delete the current User without a associated Profile', () => {
                let body = {
                    query: `
                            mutation {
                                deleteCurrentUser
                            }
                        `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${withoutProfileUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.deleteCurrentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`Error: User with id ${withoutProfileUserId} not found in profiles`);
                    }).catch(handleError);

            });

            //#endregion

            //#region  -- Should return an error, trying to delete an nonexistent User --

            it('Should return an error, trying to delete an nonexistent User', () => {
                let body = {
                    query: `
                            mutation {
                                deleteCurrentUser
                            }
                        `
                };

                return chai.request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json')
                    .set('authorization', `Bearer ${temporaryUserToken}`)
                    .send(JSON.stringify(body))
                    .then(res => {
                        const errors = res.body.errors;
                        expect(res.body.data.deleteCurrentUser).to.be.null;
                        expect(res.body).to.have.keys(['data', 'errors']);
                        expect(errors).to.be.an('array');
                        expect(errors[0].message).to.equal(`TypeError: Cannot read property 'id' of undefined`);
                    }).catch(handleError);

            });

            //#endregion
        });

        //#endregion

    });

    //#endregion



});