@app.route('/PastElection', methods=['GET'])
def get_past_elections():
    try:
        current_time = datetime.now(timezone.utc)  # Current UTC time
        app.logger.debug(f"Current UTC time: {current_time}")

        # Fetch all elections
        elections = Election.query.all()

        # Filter for past elections
        past_elections = []
        for election in elections:
            start_date = election.start_date
            start_time = election.start_time
            end_date = election.end_date
            end_time = election.end_time

            # Combine date and time
            start_datetime = datetime.combine(start_date, start_time, tzinfo=timezone.utc)
            end_datetime = datetime.combine(end_date, end_time, tzinfo=timezone.utc)

            app.logger.debug(f"Checking election {election.name} - Start (UTC): {start_datetime}, End (UTC): {end_datetime}")

            if current_time > end_datetime:
                # Gather party names for the election from candidates
                party_names = [candidate.party for candidate in election.candidates]

                # Append required fields including start and end timestamps and party names
                past_elections.append({
                    "electionId": election.id,
                    "electionName": election.name,
                    "start_time": start_datetime.isoformat().replace("+00:00", "Z"),  # Ensure Z for UTC
                    "end_time": end_datetime.isoformat().replace("+00:00", "Z"),    # Ensure Z for UTC
                    "party_names": party_names
                })

        app.logger.debug(f"Past elections: {past_elections}")

        return jsonify(past_elections), 200


    except Exception as e:
        app.logger.error(f"Error fetching past elections: {str(e)}")
        return jsonify({"error": str(e)}), 500

