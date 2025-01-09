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
            election_id = candidate_data.get('election_id')

            
            if not all([name, manifesto, photo_url, age, status, education, election_id]):
                return jsonify({"error": "Missing required candidate information."}), 400

            
            processed_candidates.append(Candidate(
                name=name,
                manifesto=manifesto,
                photo_url=photo_url,
                age=age,
                status=status,
                education=education,
                election_id=election_id
            ))

        
        db.session.add_all(processed_candidates)
        db.session.commit()

        
        return jsonify({"message": "Candidates added successfully."}), 201

    except Exception as e:
        app.logger.error(f"Error adding candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500
