const openaiClient = require('./api.js') ;

const generate = async(conditions) => {
  const response = await openaiClient.createCompletion({
    model: "text-davinci-003",
    prompt: "Travel plan with suggested itineraries for each day and a JSON-style array with keys (place, cost, transportation, currency) at the end, based on the following conditions." + conditions,
    max_tokens: 4000,
    temperature: 1,
  })

  return response.data.choices[0].text;
}

exports.generate = generate;