let conditions = {};

const onSubmit = async(event)=> {
    event.preventDefault();   
    const formData = new FormData(event.target);
    let prev
    for(var pair of formData.entries()) {
        // console.log(pair[0]+ ', '+ pair[1]);
        // console.log(typeof pair[0]);
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

    console.log(JSON.stringify(conditions));

    const generatedPlan = await generateResponse();
    console.log(generatedPlan);
}

const generateResponse = async()=>{
    const resGenerater = await fetch('http://localhost:3000/planner', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(conditions)
      });
    let data = await resGenerater.json();
    return data.response;    
}

