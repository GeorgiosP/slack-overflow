exports.handler = (event, context, callback) => {
  let axios = require('axios')
  let qs = require('querystring')

  //by default its set to null
  let { text = null } = qs.parse(event.body)

  let params = qs.stringify({
    site: 'stackoverflow.com',
    sort: 'votes',
    pagesize: 5,
    q: text,
  })

  let respond = body =>
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

  // if the text value is null just send a response skip the api call.
  text === null
    ? respond({
        response_type: 'in_channel',
        text: `Woops! looks like you forgot your question? try again.`,
      })
    : axios
        .get(`https://api.stackexchange.com/search/advanced?${params}`)
        .then(({ data }) => {
          respond({
            response_type: 'in_channel',
            text: `Perhaps one of these links can help!
${data.items
              .map(q => `<${q.link}|${q.title}> *Score: ${q.score}*`)
              .join('\n')}`,
          })
        })
        .catch(error => respond({ text: error.message }))
}
