candidates_storage = []

@app.route('/api/candidates/list', methods=['POST'])
def add_candidates():
    try:
        data = request.json
        print(data)

        candidates_data = data.get('candidate')
        election_id = data.get('electionId')
        election_name = data.get('electionName')

        if not candidates_data or not isinstance(candidates_data, list):
            return jsonify({"error": "Invalid data format, expected a list of candidates."}), 400

        if not election_id or not election_name:
            return jsonify({"error": "Missing election ID or election name."}), 400

        processed_candidates = []

        for candidate in candidates_data:
            name = candidate.get('name')
            manifesto = candidate.get('manifesto')
            photo_url = candidate.get('photo_url')
            age = candidate.get('age')
            status = candidate.get('status')
            education = candidate.get('education')
            party = candidate.get('party')

            if not all([name, manifesto, photo_url, age, status, education, party]):
                return jsonify({"error": "Missing required candidate information."}), 400

            processed_candidates.append({
                'id': candidate.get('id'),  
                'name': name,
                'manifesto': manifesto,
                'photo_url': photo_url,
                'age': age,
                'status': status,
                'education': education,
                'party': party,
                'election_id': election_id
            })

  
        election_exists = False
        for election in candidates_storage:
            if election['electionId'] == election_id:
                election['candidate'] = processed_candidates 
                election_exists = True
                break
        
        if not election_exists:
            candidates_storage.append({
                'candidate': processed_candidates,
                'electionId': election_id,
                'electionName': election_name
            })

        print(candidates_storage)

        return jsonify({"message": "Candidates added successfully."}), 201

    except Exception as e:
        app.logger.error(f"Error adding candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates/list', methods=['GET'])
def get_all_candidates():
    try:
        if not candidates_storage:
            return jsonify({"message": "No candidates available."}), 404
        
        return jsonify(candidates_storage), 200

    except Exception as e:
        app.logger.error(f"Error retrieving candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500
