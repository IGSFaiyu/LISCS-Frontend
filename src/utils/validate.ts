// 校验手机号 max 8 number
export const validateMobile = (rule, value, callback) => {
  if (value) {
    const reg = /^\d{0,8}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('Invalid phone number'))
    }
  } else {
    callback()
  }
}

// 检验邮箱  validate include @
export const validateEmail = (rule, value, callback) => {
  if (value) {
    const reg = /^[^@]+@[^@]+$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('Invalid email'))
    }
  } else {
    callback()
  }
}

// 必填校验
export const validateRequired = (rule, value, callback) => {
  if (value) {
    callback()
  } else {
    callback(new Error('required'))
  }
}

/**
 * 校验香港身份证工具方法
 * @param str  待验证的身份证字符串， 形如 F543210A， 最后一位校验码不用括号包裹
 * @param callback 回调函数
 * @returns void
 */
export function validateHKIDUtil(str, callback) {

  var strValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (str.length < 8) {
    callback(new Error('Incorrect format'))
    return
  }
  str = str.toUpperCase();
  var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
  var matchArray = str.match(hkidPat);
  if (matchArray == null) {
    callback(new Error('Incorrect format'))
    return
  }
  var charPart = matchArray[1];
  var numPart = matchArray[2];
  var checkDigit = matchArray[3];
  var checkSum = 0;
  if (charPart.length == 2) {
    checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
    checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
  } else {
    checkSum += 9 * 36;
    checkSum += 8 * (10 + strValidChars.indexOf(charPart));
  }

  for (var i = 0, j = 7; i < numPart.length; i++, j--) {
    checkSum += j * numPart.charAt(i);
  }
  var remaining = checkSum % 11;
  var verify = remaining == 0 ? 0 : 11 - remaining;
  if (verify == checkDigit || (verify == 10 && checkDigit == 'A')) {
    callback()
  } else {
    callback(new Error('Incorrect format'))
  }

}