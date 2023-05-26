const onSubmit = async(event)=> {
    event.preventDefault();   
    const generatedPlan = await generateResponse();
    console.log(generatedPlan);
}

const generateResponse = async()=>{
    let resGenerater = await fetch('http://localhost:3000//planner', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: new FormData(formElem)
      });
    let data = await resGenerater.json();
    return data.response;    
}

