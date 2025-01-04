const result_data=[
    {voteId:234,party:"A",time:"2024-12-22T15:40:07+00:00"},
    {voteId:345,party:"B",time:"2024-12-22T15:43:51+00:00"},
    {voteId:443,party:"A",time:"2024-12-22T15:37:51+00:00"},
    {voteId:389,party:"C",time:"2024-12-22T15:32:08+00:00"},
    {voteId:532,party:"C",time:"2024-12-22T15:41:11+00:00"},
    {voteId:348,party:"B",time:"2024-12-22T15:44:03+00:00"},
    {voteId:256,party:"A",time:"2024-12-22T15:42:20+00:00"},
    {voteId:467,party:"C",time:"2024-12-22T15:43:06+00:00"},
    {voteId:135,party:"B",time:"2024-12-22T15:39:02+00:00"},
    {voteId:217,party:"B",time:"2024-12-22T15:35:10+00:00"},
    {voteId:439,party:"C",time:"2024-12-22T15:38:02+00:00"},
    {voteId:270,party:"A",time:"2024-12-22T15:36:06+00:00"},
    {voteId:790,party:"B",time:"2024-12-22T15:35:13+00:00"},
    {voteId:760,party:"A",time:"2024-12-22T15:37:28+00:00"},
    {voteId:878,party:"B",time:"2024-12-22T15:42:18+00:00"},
    {voteId:641,party:"A",time:"2024-12-22T15:39:13+00:00"},
    {voteId:643,party:"A",time:"2024-12-22T15:41:14+00:00"},
    {voteId:754,party:"C",time:"2024-12-22T15:32:27+00:00"}
]

const timeVSVote=[];
var time_stamp=[];



function createArray(party){
    
    const start=new Date("2024-12-22T15:30:00+00:00");
    const end=new Date("2024-12-22T15:45:00+00:00");

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
        nextMinute.setMinutes(nextMinute.getMinutes()+3);
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


createArray("A");
createArray("B");
createArray("C");

// console.log(timeVSVote);

// module.exports=timeVSVote;
// module.exports=timeStamp;

const timeStamp=time_stamp.map((item)=>{
    
    var container=new Date(item)
    return container.toISOString();
})



console.log(time_stamp);

console.log(timeStamp);

export {timeVSVote,timeStamp};