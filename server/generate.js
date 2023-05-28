import openaiClient from './api.js' ;

const generate = async(conditionsJSON) => {
  let parse_data = JSON.parse(conditionsJSON);
  let conditions = "";
  for (let key in parse_data) {
    conditions+= key + ": " 
    conditions+= parse_data[key] + ", " 
  }
  const response = await openaiClient.createCompletion({
    model: "text-davinci-003",
    prompt: `Suggest a geographically efficient travel plan of Japan with the following conditions:,
      "The departure point is the prefectural capital of the chosen prefecture.",
      "The response should be JSON-formatted with keys in the format 'DAY {day number}'.",
      "For each day, create keys with visiting places' names in the itinerary order.",
      "Use the place names as keys, and the values should be an object with the following keys:",
      "- 'transportation': The mode of transportation",
      "- 'transportFee': The transport fee in Japanese yen",
      "- 'transportTime': The estimated travel time",
      "- 'shortDescriptionOfExperienceThere': A brief description of the experience at the place",
      "- 'famousFood': An array of famous foods at the place",
      "The transport fee and time should be calculated from the previous suggested place except for the first place and should include the unit",
      "The costs should be calculated in Japanese yen and should include the unit.
      "Conditions:"` + conditions,
    max_tokens: 3000,
    temperature: 0,
  })

  return response.data.choices[0].text;
}

export default generate;



// openaiのAPIを用いて旅行プランと建ててくれるAPIを作る

// 個人的にどハマりしてしまったのは13行目のトークン。このトークンは解答用の量を示す。4000トークンに設定していた時、質問量が多くなると理由のわからないサーバーエラーが起こってしまって困った↓ エラーはすぐに読む○
// message: "This model's maximum context length is 4097 tokens, however you requested 4098 tokens (98 in your prompt; 4000 for the completion). Please reduce your prompt; or completion length."

