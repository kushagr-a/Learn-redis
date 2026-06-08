// make the function for redis thosee verify otp and formate will be like
// phoneNumber:otp

export function otpKey(phoneNumber) {
    return `otp:${phoneNumber}`
}

