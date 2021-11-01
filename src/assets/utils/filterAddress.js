export default (address, d = 5) => {
  // console.log('filter address', address)
  if (!address) {
    return ''
  }
  return `${address.substr(0, d)}...${address.substr(-d)}`
}
