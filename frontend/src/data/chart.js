const timeVSVote=[];
var time_stamp=[];


const createResultArray=async(electionId)=>{
    const response=await fetch('http://localhost:5000/api/votes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }});
    
    const data=await response.json();
    // console.log('Data of the data page',data);
    const result_Array=[];
    console.log(data);
    data.map((individual)=>{
        console.log(individual);
        console.log(electionId);
        if(individual.electionId===electionId)
        {
            console.log(individual);
            result_Array.push(individual);
        }   
    })
    console.log(result_Array)

    return result_Array;

}

//election=object component of selected electionId
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
                if(data.partyName===party)
                {
                    if(data.timeStamp>=startISO && data.timeStamp<endISO){
                        vote_count++;
                    }
                }
        })
        vote_array.push(vote_count);
        i.setMinutes(i.getMinutes()+5);
    }

     timeVSVote.push({name:party,data:vote_array});
}

//party==election data==one objected selected electionId
const ChartDB=(election,id,data)=>{



    election.map((individual)=>{
        createArray(individual,data,id)
    }
    )


    const timeStamp=time_stamp.map((item)=>{
    
    var container=new Date(item)
    return container.toISOString()
    })

    return {timeVSVote, timeStamp}
}

export default ChartDB;
