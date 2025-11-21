const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const photoURLRegex = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpe?g|gif|png|webp)$/i

const BASE_URL = "https://eoffice.globalfibertel.com/vi/"

module.exports = {
    emailRegex,
    passwordRegex,
    photoURLRegex,
    BASE_URL,
}