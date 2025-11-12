const { emailRegex, passwordRegex } = require("./constants");

const isValidAdminCredentials = (values) => {
    const { fristName, lastName, email, password } = values;

    if (!fristName >= 4 && fristName < 35) {
        throw new Error("firstname must be in 4 to 35 characters...!")
    }
    if (!lastName >= 4 && lastName < 35) {
        throw new Error("lastname must be in 4 to 35 characters...!")
    }
    if (!emailRegex.test(email)) {
        throw new Error("Email id already exists!. Please login..!")
    }
    if (!passwordRegex.test(password)) {
        throw new Error("Password is not strong..!")
    }
    return true;
}

const isValidCredentials = (values) => {
    const { email, password } = values;

    if (!emailRegex.test(email)) {
        throw new Error("Email is not valid.!!");
    }
    else if (!passwordRegex.test(password)) {
        throw new Error("Invalid password.!!")
    }
    return true;
}

module.exports = {
    isValidCredentials,
    isValidAdminCredentials,
};