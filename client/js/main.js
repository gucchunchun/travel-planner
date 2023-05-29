const onSubmit = async(event)=> {
    // defaultのsubmitイベントを停止
    event.preventDefault();  
    // インプット画面を隠し、AIのプラン表示画面を見えるようにする
    userInput.classList.add('hidden');
    submitButton.classList.add('hidden');
    madePlan.classList.remove('hidden');
    conditionsBox.classList.remove('hidden');
    disappearFlag();
    const loadingInterval = setInterval(toggleLoading,1000);

    const formData = new FormData(event.target);
    let prev
    let conditions = {};
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

    showConditons(conditions);

    const generatedPlan = await generateResponse(conditions);
    console.log(generatedPlan);

    clearInterval(loadingInterval);
    if(loadingMessage.style.display === 'none'){
        loadingMessage.style.display = "block";
    }
    loadingMessage.innerHTML = "Your plan has been generated"

    setTimeout(function(){
        loadingMessage.classList.add("hidden");
        showResponse(generatedPlan);
    },2000);
}

const generateResponse = async(c)=>{
    // ローカルサーバーにユーザーのインプット（条件）をPOSTする
    const resGenerater = await fetch('http://localhost:3000/planner', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(c)
      });
    let data = await resGenerater.json();
    return data.response;    
}

function showResponse(response) {
    const data = JSON.parse(response);
    const days = Object.keys(data).length;
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
                        trasnportationDiv.innerHTML += listContents + ", ";
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
                            foodSpan.innerHTML = food + ", ";
                            // flickerAPIとコネクトしてfoodの写真表示ができるようにする？
                            foodSpan.classList.add("foodName");
                            foodSpan.id = food;
                            foodDiv.appendChild(foodSpan);
                        }
                        temp = foodDiv.lastChild.innerHTML;
                        foodDiv.lastChild.innerHTML= temp.replace(", ","");
                        break;
                }
            }
            section.appendChild(planDiv);
        madePlan.appendChild(section);
        }
    }
}

function showConditons(conditions) {
    console.log(conditions);
    for(let key of Object.keys(conditions)) {
        const p = document.createElement('p');
        let array=conditions[key];
        switch(key) {
            case "departPrefecture":
                p.innerHTML = "Departure prefecture: " + array;
                break;
            case "destinationIsLike":
                p.innerHTML = "Destination is like: ";
                //[[[a,b]c]d]選択方法によって配列の形が異なるため
                while(Array.isArray(array)){
                    let newArray=[];
                    for(let i=0; i<array.length; i++){
                        if(Array.isArray(array[i])){
                            newArray.push(array[i]);
                        }else{
                            p.innerHTML += array[i] + ", "
                        }
                    }
                    array=newArray[0];
                }
                if(typeof array === "string"){
                    p.innerHTML += array;
                }
                p.innerHTML=omitSpace(p.innerHTML);
                break;
            case "activity":
                p.innerHTML = "Activities: ";
                //[[[a,b]c]d]選択方法によって配列の形が異なるため
                while(Array.isArray(array)){
                    let newArray=[];
                    for(let i=0; i<array.length; i++){
                        if(Array.isArray(array[i])){
                            newArray.push(array[i]);
                        }else{
                            p.innerHTML += " " + array[i] + ","
                        }
                    }
                    array=newArray[0];
                }
                if(typeof array === "string"){
                    p.innerHTML += array;
                }
                p.innerHTML=omitSpace(p.innerHTML);
                break;
            case "trip-duration":
                p.innerHTML = "Duration: " + array;
                break;
            case "budget":
                p.innerHTML = "Budget: " + array;
                break;
            case "travel-companions":
                p.innerHTML = "Companions: " + array;
                break;
        }
        conditionsBox.appendChild(p);
    }
}

function disappearFlag() {
    var sheets = document.styleSheets
    var sheet = sheets[sheets.length - 1];

    sheet.insertRule(
        '#submitSpace::before,#submitSpace::after {display: none}',
        sheet.cssRules.length
      );
}

function toggleLoading() {
    if(loadingMessage.style.display === 'none'){
        loadingMessage.style.display = "block";
    } else {
        loadingMessage.style.display = "none";
    }
}

function omitSpace(string) {
    const spaceIndex = string.lastIndexOf(",");
    return string.slice(0, spaceIndex);
}