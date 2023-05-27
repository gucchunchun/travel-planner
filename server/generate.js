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
    prompt: conditions + `Suggest an geographically efficienttravel plan of Japan with above conditions. Response should be JSON formatted with Key of day number. For each values, make a array with keys(visiting-city, visiting-place, trasnportation, transport-fee, transport-time, what-to-do, typical-food). what-to-do value should be a array of activities name and the costs`,
    max_tokens: 3500,
    temperature: 0.4,
  })

  return response.data.choices[0].text;
}

export default generate;



// openaiのAPIを用いて旅行プランと建ててくれるAPIを作る

// 個人的にどハマりしてしまったのは13行目のトークン。このトークンは解答用の量を示す。4000トークンに設定していた時、質問量が多くなると理由のわからないサーバーエラーが起こってしまって困った↓ エラーはすぐに読む○
// message: "This model's maximum context length is 4097 tokens, however you requested 4098 tokens (98 in your prompt; 4000 for the completion). Please reduce your prompt; or completion length."

