// 格式化数字为货币形式
export function formattedAmount(amount, isNumber) {
  if (isNumber) {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  } else {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
// 将接口返回值格式化为展示的值
export function formatResponse(options,responseValue) {
  if(responseValue===null || responseValue===""){
    return "N/A"
  }
  const foundOption = options.find(option => option.value === responseValue);
  return foundOption ? foundOption.label : responseValue;
}

// 将展示的值还原为接口返回值
export function revertFormatVal(options, formatValue) {
  if (formatValue === "N/A") {
    return null;
  }
  const foundOption = options.find(option => option.label === formatValue);
  return foundOption ? foundOption.value : formatValue;
}
