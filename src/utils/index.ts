import { randomInt } from "crypto";


function generateTransactionReference(): string {
    const now = new Date();
    const datePrefix = now.getFullYear().toString().slice(2) + String(now.getMonth() + 1).padStart(2, "0")+ String(now.getDate()).padStart(2, "0");
    const randomPart = String(randomInt(1e10, 9e10))
    const checksum = String(randomInt(100, 990))
    return datePrefix + randomPart + checksum
}

console.time("Transaction reference generation")
for (let i=0; i < 1000000; i++){
    generateTransactionReference()
}
console.timeEnd("Transaction reference generation")
console.log(generateTransactionReference())