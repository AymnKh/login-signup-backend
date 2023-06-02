export function validateEgyptPhoneNumber(phoneNumber) {
  const egyptPhoneNumberRegex = /^(?:\+20|0)?1[0125][0-9]{8}$/; // 010, 011, 012, 015
  return egyptPhoneNumberRegex.test(phoneNumber); // true or false
}
