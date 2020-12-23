import numeral from 'numeral'

const formatMoney = amount => numeral(amount * 1000).format('($0.0a)')

export {
  formatMoney
}
