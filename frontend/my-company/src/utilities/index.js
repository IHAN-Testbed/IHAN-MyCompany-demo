import API from 'utilities/api'

const getPublicUrl = () => {
  /* eslint-disable no-undef */
  if (process && process.env && typeof process.env.PUBLIC_URL === 'string') {
    return process.env.PUBLIC_URL
  } else {
    return '/'
  }
  /* eslint-enable no-undef */
}

const getDelay = async (ms = 1000) => {
  return await new Promise((r) => setTimeout(r, ms))
}

const getUrlParams = (names) => {
  const params = new URLSearchParams(document.location.search.substring(1))
  const data = {}
  for (const name of names) {
    data[name] = params.get(name)
  }
  return data
}

const getRandom = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

export { API, getPublicUrl, getDelay, getUrlParams, getRandom }
