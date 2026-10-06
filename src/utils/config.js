export const url = import.meta.env.VITE_API_URL

export const serverUrl = import.meta.env.VITE_SERVER_URL

export const getHeader = () => {
  try {
    const auth = localStorage.getItem('token')

    return {
      Accept: 'application/json',
      Authorization: auth ? `Bearer ${auth}` : '',
    }
  } catch (error) {
    localStorage.clear()
  }
}