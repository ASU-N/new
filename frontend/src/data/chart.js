const createResultArray = async (electionId) => {
    const response = await fetch('http://localhost:5000/api/votes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    const result_Array = [];

    data.forEach((individual) => {
        if (individual.electionId === electionId) {
            result_Array.push(individual);
        }
    });

    return result_Array;
}

const createArray = async (party, election, id, timeVSVote, time_stamp) => {
    const result_data = await createResultArray(id);
    console.log(`Result of specific ${id} and ${party}`, result_data);
    const start = new Date(election.start_time);
    const end = new Date(election.end_time);
    console.log(start, end);
    const i = new Date(start);
    const vote_array = [];

    while (i < end) {
        if (!time_stamp.includes(i.getTime())) {
            time_stamp.push(i.getTime());
        }

        let vote_count = 0;
        const startISO = i.toISOString();
        const nextMinute = new Date(i);
        nextMinute.setMinutes(nextMinute.getMinutes() + 30);
        const endISO = nextMinute.toISOString();

        result_data.forEach((data) => {
            if (data.partyName === party && data.timeStamp >= startISO && data.timeStamp < endISO) {
                vote_count++;
            }
        });

        vote_array.push(vote_count);
        i.setMinutes(i.getMinutes() + 30);
    }

    timeVSVote.push({ name: party, data: vote_array });
    console.log('Result of timeVsVote and timeStamp', timeVSVote, time_stamp);
}

const ChartDB = async (partyName, electionId, electionData) => {
    // Reset arrays for each call
    const timeVSVote = [];
    const time_stamp = [];

    await Promise.all(partyName.map(async (individual) => {
        console.log('Before create array', individual, 'ElectionId', electionId);
        await createArray(individual, electionData, electionId, timeVSVote, time_stamp);
    }));

    const timeStamp = time_stamp.map((item) => {
        return new Date(item).toISOString();
    });

    console.log('Before Sending to Apex Chart', timeStamp, timeVSVote, 'For ElectionId', electionId);

    return { timeVSVote, timeStamp };
}

export default ChartDB;

