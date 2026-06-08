// here generate random otp like :- 514977

export function otp() {
    return Math.floor(1000 + Math.random() * 900000).toString();
}