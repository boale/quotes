/**
 * @param {T} arr
 * @returns {T}
 */
export function getRandomFromArray<T>(arr: T[]): T {
  return Array.isArray(arr) && arr[ Math.floor(Math.random() * arr.length) ];
}
