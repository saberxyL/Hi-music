export default [
  {
    url: '/api/hello',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: 'hello world'
      }
    }
  }
]
