import { t } from "i18next";

function handlePasswordValidation(value, name = t("pages.common.labels.pasword")) {
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;
  const passwordLength = passwordInputValue.length;
  const uppercasePassword = uppercaseRegExp.test(value);
  const lowercasePassword = lowercaseRegExp.test(value);
  const digitsPassword = digitsRegExp.test(value);
  const specialCharPassword = specialCharRegExp.test(value);
  const minLengthPassword = minLengthRegExp.test(value);
  let errMsg = "";
  if (passwordLength === 0) {
    errMsg = `${name} là bắt buộc`;
  } else if (!uppercasePassword) {
    errMsg = `${name} phải có ít nhất 1 kí tự viết hoa`;
  } else if (!lowercasePassword) {
    errMsg = `${name} phải có ít nhất 1 kí tự viết thường`;
  } else if (!digitsPassword) {
    errMsg = `${name} phải có ít nhất 1 số`;
  } else if (!specialCharPassword) {
    errMsg = `${name} phải có ít nhất 1 kí tự đặc biệt`;
  } else if (!minLengthPassword) {
    errMsg = `${name} phải có ít nhất 8 kí tự`;
  } else {
    errMsg = "";
  }
  return errMsg;
}

export { passwordValidation };
