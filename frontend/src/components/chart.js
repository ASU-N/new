
const timeVSVote=[];
var time_stamp=[];




const createResultArray=async(electionId)=>{
    const response=await fetch('http://localhost:5000/GetAllResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }});

    const data=response.data;
    const result_Array=[];
    data.map((individual)=>{
        if(individual.electionId===electionId)
        {
            result_Array_electionId.push(individual);
        }   
    })

    return result_Array;

}




async function createArray(start,end,result_data,party,electionId){

    
    const result_data=await createResultArray(electionId);
    
    var vote_array=[];
    const i=new Date(start)
    while(i<end)
    {
       

        var bool=time_stamp.includes(i.getTime())



        console.log(bool);
        
        if(!bool)
        {
            time_stamp.push(i.getTime());
        }
        
        

        var vote_count=0;

        var startISO=i.toISOString();
        var nextMinute=new Date(i);
        nextMinute.setMinutes(nextMinute.getMinutes()+5);
        var endISO=nextMinute.toISOString();


        result_data.forEach((data)=>{
                if(data.party===party)
                {
                    if(data.time>=startISO && data.time<endISO){
                        vote_count++;
                    }
                }
        })
        vote_array.push(vote_count);


        i.setMinutes(i.getMinutes()+3);
    }
        timeVSVote.push({name:party,data:vote_array});

}
