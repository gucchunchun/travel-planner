import openaiClient from './api.js' ;

const generate = async(conditionsJSON) => {
  let parse_data = JSON.parse(conditionsJSON);
  let conditions = "";
  for (let key in parse_data) {
    conditions+= key + ": " 
    conditions+= parse_data[key] + ", " 
  }
  console.log(conditions);

  const response = await openaiClient.createCompletion({
    model: "text-davinci-003",
    prompt: conditions + `Suggest an geographically efficienttravel plan of Japan with above conditions. Response should be JSON formatted with Key of day number. For each values, make a array with keys(visiting-place, activities, typical-food).`,
    max_tokens: 4000,
    temperature: 0.4,
  })

  return response.data.choices[0].text;
}

export default generate;


// there is rimiting for number of tocken per minutes. thats the reason of the errors, I believe.
//https://platform.openai.com/docs/guides/rate-limits/overview

