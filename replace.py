candidates_storage = []  # This will store the elections and their candidates

@app.route('/api/candidates/list', methods=['POST'])
def add_candidates():
    try:
        # Get the incoming JSON data
        data = request.get_json()  # Expecting a JSON object
        
        # Debug logging to check the received data structure
        app.logger.debug(f"Received data: {data}")
        
        # Extract the candidate list, election ID, and election name from the data
        candidates_data = data.get('candidate')  # List of candidates
        election_id = data.get('electionId')
        election_name = data.get('electionName')

        # Validate the input data
        if not candidates_data or not isinstance(candidates_data, list):
            return jsonify({"error": "Invalid data format, expected a list of candidates."}), 400

        if not election_id or not election_name:
            return jsonify({"error": "Missing election ID or election name."}), 400

        processed_candidates = []

        # Process each candidate in the list
        for candidate in candidates_data:
            name = candidate.get('name')
            manifesto = candidate.get('manifesto')
            photo_url = candidate.get('photo_url')
            age = candidate.get('age')
            status = candidate.get('status')
            education = candidate.get('education')
            party = candidate.get('party')

            # Check for missing required candidate details
            if not all([name, manifesto, photo_url, age, status, education, party]):
                return jsonify({"error": "Missing required candidate information."}), 400

            # Prepare the candidate data for further processing
            processed_candidates.append({
                'id': candidate.get('id'),  # Assuming ID is provided for each candidate
                'name': name,
                'manifesto': manifesto,
                'photo_url': photo_url,
                'age': age,
                'status': status,
                'education': education,
                'party': party,
                'election_id': election_id
            })

        # Search for the election and replace candidates
        election_found = False
        for election in candidates_storage:
            if election['electionId'] == election_id:
                # Replace the candidate list for the existing election
                election['candidate'] = processed_candidates
                election_found = True
                break

        # If the election is not found, add it with the new candidates
        if not election_found:
            candidates_storage.append({
                'candidate': processed_candidates,
                'electionId': election_id,
                'electionName': election_name
            })

        # Log the current state of candidates storage
        app.logger.debug(f"Candidates storage after addition: {candidates_storage}")

        # Return success message
        return jsonify({"message": "Candidates list replaced successfully."}), 201

    except Exception as e:
        # Log the error and return a failure message
        app.logger.error(f"Error adding candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/candidates/list', methods=['GET'])
def get_all_candidates():
    try:
        # Get the election ID from query parameters
        election_id = request.args.get('electionId')
        
        # Validate the election ID
        if not election_id:
            return jsonify({"error": "Missing election ID."}), 400
        
        # Try to find the election with the given ID
        for election in candidates_storage:
            if str(election['electionId']) == election_id:
                # Return the candidates associated with the election
                return jsonify({
                    "electionId": election['electionId'],
                    "electionName": election['electionName'],
                    "candidates": election['candidate']
                }), 200
        
        # If election not found, return an error
        return jsonify({"error": "Election not found."}), 404

    except Exception as e:
        # Log the error and return a failure message
        app.logger.error(f"Error fetching candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500
