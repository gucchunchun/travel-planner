let conditions = {};
var generatedPlan;

const onSubmit = async(event)=> {
    // defaultのsubmitイベントを停止
    event.preventDefault();   
    const formData = new FormData(event.target);
    let prev
    // formdataはそのままではアクセス不可能なのでobject形式へ
    for(var pair of formData.entries()) {
        if(pair[0]==prev){       
            const temp = conditions[prev];
            conditions[prev] =[temp,pair[1]];
        }else{   
            conditions[pair[0]]= pair[1];    
              
        prev=pair[0];           
        }
    }
    let tmp =conditions.budget;
    let addUnit = tmp + "K japanese-yen";
    conditions.budget = addUnit;

    generatedPlan = await generateResponse();
    console.log(generatedPlan);
    showResponse(generatedPlan);
}

const generateResponse = async()=>{
    // ローカルサーバーにユーザーのインプット（条件）をPOSTする
    const resGenerater = await fetch('http://localhost:3000/planner', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(conditions)
      });
    let data = await resGenerater.json();
    return data.response;    
}

function showResponse(response) {
    userInput.classList.add('hidden');
    submitButton.classList.add('hidden');
    madePlan.classList.remove('hidden');
    const data = JSON.parse(response);
    console.log(data);
    const days = Object.keys(data).length;
    console.log(days);
    for(let i = 0; i < days; i++) {
        const section = document.createElement('section');
        // 装飾時の配置用
        section.id = i;
        section.classList.add('dayPlans');

        const dayNum = Object.keys(data)[i];
        const dayTitle = document.createElement('h3');
        dayTitle.innerHTML = dayNum;
        dayTitle.classList.add('dayNum');
        section.appendChild(dayTitle);
        console.log(dayNum);

        // 場所ごとのプランが自動で振り分けられたindexにそれぞれ格納されている
        const plans = data[dayNum]; 
        for (let k=0; k < Object.keys(plans).length; k++) {
            const planDiv = document.createElement('div');
            planDiv.classList.add("plan");
            section.appendChild(planDiv);

            const placeName = Object.keys(plans)[k];
            const h6 = document.createElement('h6');
            h6.innerHTML = (k+1) + ", " + placeName;
            h6.classList.add("location");
            planDiv.appendChild(h6);

            const planDetail = plans[placeName];

            const trasnportationDiv = document.createElement('div');
            trasnportationDiv.classList.add('trasnportation');

            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('description');

            const foodDiv = document.createElement('div');
            foodDiv.classList.add('famousFood');

            planDiv.appendChild(trasnportationDiv);
            planDiv.appendChild(descriptionDiv);
            planDiv.appendChild(foodDiv);

            for(let k=0; k < 5; k++){
                const listKey = Object.keys(planDetail)[k];
                const listContents  = planDetail[listKey];
                switch (listKey) {
                    case "transportation":
                        trasnportationDiv.innerHTML = "Transportation: "+ listContents;
                        break;
                    case "transportFee":
                        trasnportationDiv.innerHTML += "(¥" + listContents + ", ";
                        break;
                    case "transportTime":
                        trasnportationDiv.innerHTML += listContents + ")";
                        break;
                    case "shortDescriptionOfExperienceThere":
                        descriptionDiv.innerHTML =  listContents;
                        break;
                    case "famousFood":
                        foodDiv.innerHTML += "Famous food: ";
                        for(let food of listContents) {
                            const foodSpan = document.createElement("span");
                            foodSpan.innerHTML = food;
                            // flickerAPIとコネクトしてfoodの写真表示ができるようにする？
                            foodSpan.classList.add("foodName");
                            foodSpan.id = food;
                            foodDiv.appendChild(foodSpan);
                        }
                        break;
                }
            }
            section.appendChild(planDiv);
        madePlan.appendChild(section);
        }
    }
}

