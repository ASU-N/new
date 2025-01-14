const timeVSVote=[];
var time_stamp=[];


const createResultArray=async(electionId)=>{
    const response=await fetch('http://localhost:5000/api/votes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }});

    const data=response.data;
    const result_Array=[];
    data.map((individual)=>{
        if(individual.electionId===electionId)
        {
            result_Array.push(individual);
        }   
    })

    return result_Array;

}

const createArray=async (party,election,id)=>{
    

    const result_data=await createResultArray(id);
    const start=new Date(election.start_time);
    const end=new Date(election.end_time);

    const i=new Date(start);
    const vote_array=[];

    while(i<end)
    {
        var bool=time_stamp.includes(i.getTime());
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
        i.setMinutes(i.getMinutes()+5);
    }

     timeVSVote.push({name:party,data:vote_array});
}

const chart=(election,id)=>{

    const Partys=election.party;
    Partys.map((individual)=>{
        createArray(individual.partyName,individual,id)
    })

    const timeStamp=time_stamp.map((item)=>{
    
    var container=new Date(item)
    return container.toISOString()
    })

    return {timeVSVote, timeStamp}
}