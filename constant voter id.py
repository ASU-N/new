@app.route('/api/check_vote_data', methods=['POST'])
def check_vote_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract data from the received JSON
    party_name = data.get('partyName')
    election_id = data.get('electionId')
    timestamp = data.get('timeStamp')

    # If any required data is missing, return an error
    if not party_name or not election_id or not timestamp:
        return jsonify({"error": "Missing required data"}), 400

    timestamp = datetime.fromisoformat(timestamp)

    try:
        # Log received data
        app.logger.debug(f"Received vote data - Party: {party_name}, Election ID: {election_id}, Timestamp: {timestamp}")

        # Check if the voter ID has already voted in this election
        voterr_id = 88  # Constant voter ID for testing
        existing_vote = Vote.query.filter_by(election_id=election_id, voter_id=voterr_id).first()

        if existing_vote:
            # Log and return error if vote already exists
            app.logger.debug(f"Vote already recorded for Voter ID {voterr_id} in Election ID {election_id}")
            return jsonify({"error": "Previously voted for this election!"}), 400

        # Log election and voter data
        app.logger.debug(f"Proceeding to record vote for Election ID {election_id}, Voter ID {voterr_id}")

        # Save the vote to the database
        election = Election.query.get(election_id)
        if not election:
            app.logger.error(f"Election ID {election_id} not found in the database.")
            return jsonify({"error": "Election not found"}), 404

        new_vote = Vote(party_name=party_name, election_id=election_id, voter_id=voterr_id, timestamp=timestamp)
        db.session.add(new_vote)
        db.session.commit()

        # Log success
        app.logger.debug(f"Vote recorded successfully for Voter ID {voterr_id} in Election ID {election_id}")

        # Send the response back with timestamp and election_id
        return jsonify({
            "message": "Vote recorded successfully!",
            "electionId": election_id,
            "timeStamp": timestamp.isoformat()
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error while recording vote: {str(e)}")
        return jsonify({"error": "Failed to record vote"}), 500
