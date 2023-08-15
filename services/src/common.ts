
export function toMoneyFormat(num: number): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })
}