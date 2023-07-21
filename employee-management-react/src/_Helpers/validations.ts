const patterns = {
    contactNo: /^[0-9]*$/,
    email: /^[a-zA-Z0-9.$%&*_]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
}

const messages = {
    password: 'Password must containe at least 8 characters including 1 capital letter, 1 small letter, 1 digit and 1 special character',
    contactLength: 'Contact No must be of 10 digits',
    digitOnly: 'Contact No should contain digits only',
    confPassMatch: 'Confirm Password does not match',
    emailValid: 'Email is invalid',
}

export const validations = {
    patterns,
    messages
}
