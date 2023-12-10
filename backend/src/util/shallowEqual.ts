export const shallowEqual = <T extends Record<string, unknown>>(
  objLeft: T,
  objRight: T,
): boolean => {
  if (objLeft === objRight) {
    return true
  }

  if (
    typeof objLeft !== 'object' ||
    objLeft === null ||
    typeof objRight !== 'object' ||
    objRight === null
  ) {
    return false
  }

  const keysA = Object.keys(objLeft)
  const keysB = Object.keys(objRight)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objRight, key) ||
      objLeft[key] !== objRight[key]
    ) {
      return false
    }
  }

  return true
}
