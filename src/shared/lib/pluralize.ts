export const pluralize = (count: number, forms: [string, string, string]) => {
  const absCount = Math.abs(count) % 100
  const lastDigit = absCount % 10

  if (absCount > 10 && absCount < 20) {
    return forms[2]
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1]
  }

  if (lastDigit === 1) {
    return forms[0]
  }

  return forms[2]
}
