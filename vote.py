
"""class PartyDetails(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    partyname = db.Column(db.String(100), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    timestamp = db.Column(db.String, nullable=False)  # Store timestamp as ISO string

    election = db.relationship('Election', backref=db.backref('party_details', lazy=True))

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key for the vote
    voter_id = db.Column(db.Integer, nullable=False)  # ID of the voter who cast the vote
    partyname = db.Column(db.String(100), nullable=False)  # The party the voter voted for
    timestamp = db.Column(db.String, nullable=False)  # The time the vote was cast


@app.route('/api/vote', methods=['POST'])
def cast_vote():
    try:
        # Retrieve voter ID from session
        voter_id = session.get('voter_id')  # Assuming voter_id is stored in session

        if not voter_id:
            return jsonify({"error": "Voter ID is required"}), 400

        # Retrieve the party details from the POST request
        data = request.json
        partyname = data.get('partyname')
        election_name = data.get('election_name')
        timestamp = data.get('timestamp')

        if not partyname or not election_name or not timestamp:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the voter has already voted
        existing_vote = Vote.query.filter_by(voter_id=voter_id).first()
        if existing_vote:
            return jsonify({"error": "You have already voted"}), 400

        # Assuming `PartyDetails` is a model that holds the party information
        party_details = PartyDetails.query.filter_by(partyname=partyname).first()

        if not party_details:
            return jsonify({"error": "Party not found"}), 404

        # Save the vote information
        vote = Vote(voter_id=voter_id, partyname=partyname, timestamp=datetime.now())  # Assume Vote model exists
        db.session.add(vote)
        db.session.commit()

        # Respond with only party name and timestamp
        return jsonify({
            "partyname": partyname,
            "timestamp": timestamp
        }), 201

    except Exception as e:
        app.logger.error(f"Error casting vote: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route('/api/check_and_vote', methods=['GET'])
def check_and_vote():
    try:
        # Retrieve voter_id from the session
        voter_id = session.get('voter_id')  # Assuming voter_id is stored in session

        if not voter_id:
            return jsonify({"error": "Voter ID is required"}), 400  # If voter ID is not found in the session

        # Check if this voter has already voted
        existing_vote = Vote.query.filter_by(voter_id=voter_id).first()  # Assuming Vote model exists

        if existing_vote:
            return jsonify({"error": "You have already voted"}), 400  # Voter has already voted

        # Get the party details to display (assuming the election is ongoing)
        party_details = PartyDetails.query.order_by(PartyDetails.timestamp).first()  # Retrieve the first party (or filter by active elections)

        if not party_details:
            return jsonify({"error": "No active party found"}), 404  # No active party found

        # Return the party name and timestamp to the frontend
        response_data = {
            "partyname": party_details.partyname,
            "timestamp": party_details.timestamp
        }
        
        # The frontend can display this data and ask the voter to confirm the vote
        return jsonify(response_data), 200

    except Exception as e:
        app.logger.error(f"Error checking vote status: {str(e)}")
        return jsonify({"error": str(e)}), 500


"""
