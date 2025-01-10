candidates_storage = []

@app.route('/api/candidates/list', methods=['POST'])
def add_candidates():
    try:
        candidates_data = request.json  

        if not candidates_data or not isinstance(candidates_data, list):
            return jsonify({"error": "Invalid data format, expected a list of candidates."}), 400

        processed_candidates = []

        for candidate_data in candidates_data:
            name = candidate_data.get('name')
            manifesto = candidate_data.get('manifesto')
            photo_url = candidate_data.get('photo_url')
            age = candidate_data.get('age')
            status = candidate_data.get('status')
            education = candidate_data.get('education')
            candidate_id = candidate_data.get('id')  
            party = candidate_data.get('party')
            election_id = candidate_data.get('election_id')
            election_name = candidate_data.get('election_name')

            
            if not all([name, manifesto, photo_url, age, status, education, candidate_id, party, election_id, election_name]):
                return jsonify({"error": "Missing required candidate information, including election ID and name."}), 400

            processed_candidates.append({
                'id': candidate_id,
                'name': name,
                'manifesto': manifesto,
                'photo_url': photo_url,
                'age': age,
                'status': status,
                'education': education,
                'party': party,
                'election_id': election_id,
                'election_name': election_name,
            })

        candidates_storage.extend(processed_candidates)

        return jsonify({"message": "Candidates added successfully."}), 201

    except Exception as e:
        app.logger.error(f"Error adding candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates/list', methods=['GET'])
def get_all_candidates():
    try:
       
        voter_id = session.get('voter_id', None)
        return jsonify({
            "voter_id": voter_id,
            "candidates": candidates_storage,
        }), 200
    except Exception as e:
        app.logger.error(f"Error fetching candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500
