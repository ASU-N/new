@app.route('/api/votes', methods=['GET'])
def get_votes():
    try:
        # Fetch all votes from the database
        votes = Vote.query.all()
        
        # Convert the vote data to a list of dictionaries (objects) 
        votes_data = []
        for vote in votes:
            vote_data = {
                "partyName": vote.party_name,
                "electionId": vote.election_id,
                "timeStamp": vote.timestamp.isoformat()
            }
            votes_data.append(vote_data)
        
        return jsonify(votes_data), 200
    except Exception as e:
        logging.error(f"Failed to fetch votes: {e}")
        return jsonify({"error": "Failed to fetch votes"}), 500
