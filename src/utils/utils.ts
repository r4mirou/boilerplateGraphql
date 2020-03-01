//#region handle errors

export const handleError = (error: Error) => {
    let errorMessage: string = `${error.name}: ${error.message}`;
    return Promise.reject(new Error(errorMessage));
};

export const throwError = (condition: Boolean, message: string): void => {
    if (condition) { throw new Error(message); }
}

export function customErrorValidation(message) {
    this.message = message;
    this.name = "customErrorValidation";
}

//#endregion

//#region base64

//Validation Base64

// function atob(str) {
//     return new Buffer(str, 'base64').toString('binary');
// }

// function btoa(str) {
//     let buffer;
//     if (str instanceof Buffer) {
//         buffer = str
//     } else {
//         buffer = new Buffer(str.toString(), 'binary')
//     }
//     return buffer.toString('base64')
// }

// export function isBase64(str) {
//     try {
//         return btoa(atob(str)) === str ? true : false
//     } catch (ex) {
//         false
//     }
// }

//#endregion


export const JWT_SECRET: string = process.env.JWT_SECRET;

