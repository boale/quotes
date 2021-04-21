/**
 * @returns {boolean}
 */
export function isDev(): boolean {
  return  [ 'dev', 'develop', 'development', 'dv', '', undefined ].includes(process.env.NODE_ENV);
}
