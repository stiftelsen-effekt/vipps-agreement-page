
export default function formatCurrency(currencyString: string) {
    return Number.parseFloat(currencyString).toFixed(0)
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      .replaceAll(",", ".")
  }