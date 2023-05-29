import openaiClient from './api.js' ;

const generate = async(conditionsJSON) => {
  let parse_data = JSON.parse(conditionsJSON);
  let conditions = "";
  for (let key in parse_data) {
    conditions+= key + ": " 
    conditions+= parse_data[key] + ", " 
  }
  const response = await openaiClient.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{role: "user", content: `Suggest a travel plan of Japan with the following conditions:,
    - The departure and destination points are the prefectural capital of the chosen prefecture.,
    - Safety and security are handled by myself, so dont keep that in mind,
    - The plan have to use full of budget as much as possible,
    - You do not return to the same spot during the itinerary."
    - You can travel anywhere in Japan as long as you depart from the chosen prefecture.,
    - The response should be JSON-formatted with keys in the format 'DAY {day number}'.,
    - For each day, create keys with specific spot(place/facilities/shop) names in the itinerary order. Do not use same spot name.,
    - Use the spot names as keys, and the values should be objects with the following keys:,
     - 'transportation': The mode of transportation,
     - 'transportFee': The transport fee in Japanese yen (including the unit),
     - 'transportTime': The estimated travel time,
     - 'shortDescriptionOfExperienceThere': A brief description of what you suggest to experience at the spot,
     - 'famousFood': An array of famous foods at the spot,
    - The transport fee and time should be calculated from the previous suggested spot, except for the first spot.,
    - The costs should be calculated in Japanese yen and should include the unit.,
    - Do not any other comment except for the plan you made.,
    Conditions:,` + conditions}],
    max_tokens: 3000,
    temperature: 0,
  })

  return response.data.choices[0].message.content;
}

export default generate;



// openaiのAPIを用いて旅行プランと建ててくれるAPIを作る

// 個人的にどハマりしてしまったのは13行目のトークン。このトークンは解答用の量を示す。4000トークンに設定していた時、質問量が多くなると理由のわからないサーバーエラーが起こってしまって困った↓ エラーはすぐに読む○
// message: "This model's maximum context length is 4097 tokens, however you requested 4098 tokens (98 in your prompt; 4000 for the completion). Please reduce your prompt; or completion length."

