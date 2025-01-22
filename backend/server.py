import logging
import os
import base64
import cv2
import numpy as np
import face_recognition
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from datetime import timedelta
from datetime import datetime 
from dateutil import parser
from datetime import timezone




# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:anu123@localhost/voting_system'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = b'}XJ-\xb6\x9bx\xaf\x9c[\x0b\xcaj\xd2 D/y\xe9\x88\xae\xb7\xdb\x11'

# Initialize Extensions
db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:3002"], allow_headers=["Content-Type"], supports_credentials=True)

# Logging setup
logging.basicConfig(level=logging.INFO)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        frame_data = data.get('frame')
        voter_id = data.get('voter_id')

        if not frame_data or not voter_id:
            return jsonify({"message": "Missing frame data or voter ID"}), 400

        imgdata = base64.b64decode(frame_data.split(',')[1])
        nparr = np.frombuffer(imgdata, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        face_locations = face_recognition.face_locations(img)
        if len(face_locations) != 1:
            return jsonify({"message": "Please ensure only one face is visible for registration."}), 400

        face_encoding = face_recognition.face_encodings(img, face_locations)[0]
        face_encoding_bytes = face_encoding.tobytes()

        if Voter.query.filter_by(voter_id=voter_id).first():
            return jsonify({"message": "Voter ID is already registered."}), 400

        voters = Voter.query.all()
        for voter in voters:
            db_face_encoding = np.frombuffer(voter.face_encoding, dtype=np.float64)
            if face_recognition.compare_faces([db_face_encoding], face_encoding)[0]:
                return jsonify({"message": "Face is already registered with another voter ID."}), 400

        new_voter = Voter(voter_id=voter_id, face_encoding=face_encoding_bytes)
        db.session.add(new_voter)
        db.session.commit()

        return jsonify({"message": "Registration successful!"})

    except Exception as e:
        app.logger.error(f"Error during registration: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        frame_data = data.get('frame')
        voter_id = data.get('voter_id')

        if not frame_data or not voter_id:
            return jsonify({"message": "Missing frame data or voter ID"}), 400

        imgdata = base64.b64decode(frame_data.split(',')[1])
        nparr = np.frombuffer(imgdata, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        face_locations = face_recognition.face_locations(img)
        if len(face_locations) != 1:
            return jsonify({"message": "Please ensure only one face is visible for login."}), 400

        login_face_encoding = face_recognition.face_encodings(img, face_locations)[0]

        voter = Voter.query.filter_by(voter_id=voter_id).first()
        if voter:
            db_face_encoding = np.frombuffer(voter.face_encoding, dtype=np.float64)
            matches = face_recognition.compare_faces([db_face_encoding], login_face_encoding)
            if matches[0]:
                return jsonify({"message": "Login successful"})
            else:
                return jsonify({"message": "Face did not match. Login failed."}), 400
        else:
            return jsonify({"message": "Voter ID not found in the database."}), 404

    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/logout', methods=['POST'])
def logout():
    try:
        return jsonify({"message": "Logged out successfully"})

    except Exception as e:
        app.logger.error(f"Error during logout: {str(e)}")
        return jsonify({"error": str(e)}), 500
    




class Voter(db.Model):
    voter_id = db.Column(db.Integer, primary_key=True)
    face_encoding = db.Column(db.LargeBinary, nullable=False)

class Election(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    candidates = db.relationship('Candidate', back_populates='election')

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    manifesto = db.Column(db.Text, nullable=False)
    photo_url = db.Column(db.String(200), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    age = db.Column(db.Integer, nullable=False)  
    status = db.Column(db.String(50), nullable=False) 
    education = db.Column(db.String(100), nullable=False)
    party = db.Column(db.String(100), nullable=False)
    election = db.relationship('Election', back_populates='candidates')


from sqlalchemy import UniqueConstraint


class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    party_name = db.Column(db.String(255), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    voter_id = db.Column(db.Integer, db.ForeignKey('voter.voter_id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    election = db.relationship('Election', backref=db.backref('votes', lazy=True))
    voter = db.relationship('Voter', backref=db.backref('votes', lazy=True))

    __table_args__ = (UniqueConstraint('voter_id', 'election_id', name='unique_voter_election'),)

    def __init__(self, party_name, election_id, voter_id, timestamp):
        self.party_name = party_name
        self.election_id = election_id
        self.voter_id = voter_id
        self.timestamp = timestamp

@app.route('/api/check_vote_data', methods=['POST'])
def check_vote_data():
    data = request.get_json()
    print('Check Vote',data)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract data and process vote
    party_name = data.get('partyName')
    election_id = data.get('electionId')
    timestamp = data.get('timeStamp')
    voter_id = data.get('voter_id')
    print('Type of votersId',type(voter_id))
    
    # parsed_timestamp = parser.parse(timestamp) 

    if not party_name or not election_id or not timestamp or not voter_id:
        return jsonify({"error": "Missing required data"}), 400

    try:
        parsed_timestamp = parser.parse(timestamp)
        # timestamp = datetime.fromisoformat(parsed_timestamp)

        # Check if the voter has already voted in this election

        existing_vote = Vote.query.filter_by(election_id=election_id, voter_id=int(voter_id)).first()
        if existing_vote:
            return jsonify({"error": "Voter has already voted in this election"}), 400

        # Perform database operations
        election = Election.query.get(election_id)
        if not election:
            return jsonify({"error": "Election not found"}), 404



        new_vote = Vote(party_name=party_name, election_id=election_id, timestamp=parsed_timestamp, voter_id=int(voter_id))
        db.session.add(new_vote)
        db.session.commit()

        return jsonify({
            "message": "Vote recorded successfully!",
            "partyName": party_name,
            "electionId": election_id,
            "voter_id": voter_id,
            "timeStamp": parsed_timestamp
        }), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Failed to record vote: {e}")  # Log the error
        return jsonify({"error": f"Failed to record vote: {e}"}), 500


class CandidateModelView(ModelView):

   
    form_columns = ['name', 'manifesto', 'photo_url', 'election', 'age', 'status', 'education','party']  

    def __init__(self, model, session, **kwargs):
        super(CandidateModelView, self).__init__(model, session, **kwargs)
        self.form_args = {
            'election': {
                'query_factory': lambda: Election.query.all(),
                'allow_blank': False,
                'label': 'Election'
            }
        }


class VoterModelView(ModelView):
    can_create = False  
    can_edit = False    
    can_delete = True   

    column_list = ['voter_id', 'face_encoding']  
    form_columns = ['voter_id', 'face_encoding']  
    
    def is_accessible(self):
        
        return True

    def inaccessible_callback(self, name, **kwargs):
        
        return super().inaccessible_callback(name, **kwargs)


class ElectionModelView(ModelView):
    inline_models = [Candidate]
    form_columns = ['name', 'start_date', 'start_time', 'end_date', 'end_time', 'candidates']
    def __init__(self, model, session, **kwargs):
        super(ElectionModelView, self).__init__(model, session, **kwargs)
        self.form_args = {
            'candidates': {
                'query_factory': lambda: Candidate.query.all(),
                'allow_blank': False,
                'label': 'Candidates'  
            }
        }

admin = Admin(app, name='Election Admin', template_mode='bootstrap3')
admin.add_view(CandidateModelView(Candidate, db.session))
admin.add_view(ElectionModelView(Election, db.session))
admin.add_view(VoterModelView(Voter, db.session)) 


from datetime import datetime

@app.route('/api/elections', methods=['GET'])
def get_elections():
    try:
        current_time = datetime.now() 
        app.logger.debug(f"Current time: {current_time}")

        elections = Election.query.all()

        past_elections = []
        ongoing_elections = []
        upcoming_elections = []

        for election in elections:
            start_date = election.start_date
            start_time = election.start_time
            end_date = election.end_date
            end_time = election.end_time

            
            start_datetime = datetime.combine(start_date, start_time)
            end_datetime = datetime.combine(end_date, end_time)

            app.logger.debug(f"Election {election.name} - Start: {start_datetime}, End: {end_datetime}")
            candidates = Candidate.query.filter_by(election_id=election.id).all()
            candidate_list = [
                {
                    "id": candidate.id,
                    "name": candidate.name,
                    "manifesto": candidate.manifesto,
                    "photo_url": candidate.photo_url,
                    "age": candidate.age,
                    "status": candidate.status,
                    "education": candidate.education,
                    "party": candidate.party
                }
                for candidate in candidates
            ]

            if start_datetime <= current_time <= end_datetime:
                # Ongoing election
                ongoing_elections.append({
                    "id": election.id,
                    "name": election.name,
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "start_time": start_time.strftime("%H:%M:%S"),
                    "end_date": end_date.strftime("%Y-%m-%d"),
                    "end_time": end_time.strftime("%H:%M:%S"),
                    "vote_now_button": True,
                    "candidates": candidate_list
                })
            elif current_time > end_datetime:
                # Past election
                past_elections.append({
                    "id": election.id,
                    "name": election.name,
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "start_time": start_time.strftime("%H:%M:%S"),
                    "end_date": end_date.strftime("%Y-%m-%d"),
                    "end_time": end_time.strftime("%H:%M:%S"),

                    "candidates": candidate_list
                })
            else:
                # Upcoming election
                upcoming_elections.append({
                    "id": election.id,
                    "name": election.name,
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "start_time": start_time.strftime("%H:%M:%S"),
                    "end_date": end_date.strftime("%Y-%m-%d"),
                    "end_time": end_time.strftime("%H:%M:%S"),
                    "details_here_button": True,
                    "candidates": candidate_list
                })

        app.logger.debug(f"Ongoing elections: {ongoing_elections}")
        app.logger.debug(f"Past elections: {past_elections}")
        app.logger.debug(f"Upcoming elections: {upcoming_elections}")

        return jsonify({
            "ongoing": ongoing_elections,
            "past": past_elections,
            "upcoming": upcoming_elections
        }), 200
    except Exception as e:
        app.logger.error(f"Error fetching elections: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    try:
        candidates = Candidate.query.all()
        return jsonify([{
            'id': candidate.id,
            'name': candidate.name,
            'manifesto': candidate.manifesto,
            'photo_url': candidate.photo_url,
            'age': candidate.age,  
            'status': candidate.status,  
            'education': candidate.education,
            'party': candidate.party  
        } for candidate in candidates]), 200
    except Exception as e:
        app.logger.error(f"Error fetching candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500




# Initialize candidates_storage

candidates_storage = {}


@app.route('/api/candidates/list', methods=['POST'])
def add_candidates():
    try:
        data = request.get_json()  # Use `get_json` for better JSON handling
        print("Type of 'data':", type(data))
        print("Received Data:", data)

        # Validate the received data structure
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid data format, expected a JSON object."}), 400

        # Extract fields
        candidates_data = data.get('candidate')
        election_id = data.get('electionId')
        election_name = data.get('electionName')

        # Validate extracted fields
        if not candidates_data or not isinstance(candidates_data, list):
            return jsonify({"error": "Invalid 'candidate' format, expected a list."}), 400

        if not election_id or not election_name:
            return jsonify({"error": "Missing 'electionId' or 'electionName'."}), 400

        print("Candidates Data:", candidates_data)
        print("Election ID:", election_id)
        print("Election Name:", election_name)

        processed_candidates = []

        for candidate in candidates_data:
            if not isinstance(candidate, dict):
                return jsonify({"error": f"Invalid candidate format: {candidate}"}), 400

            # Extract and validate each candidate field
            name = candidate.get('name', '').strip()
            manifesto = candidate.get('manifesto', '').strip()
            photo_url = candidate.get('photo_url', '').strip()
            age = candidate.get('age')
            status = candidate.get('status', '').strip()
            education = candidate.get('education', '').strip()
            party = candidate.get('party', '').strip()

            # Validate required fields
            if not name:
                return jsonify({"error": "Each candidate must have a 'name'."}), 400
            if not manifesto:
                return jsonify({"error": f"Candidate {name} is missing 'manifesto'."}), 400
            if not photo_url:
                return jsonify({"error": f"Candidate {name} is missing 'photo_url'."}), 400
            if not isinstance(age, int) or age <= 0:
                return jsonify({"error": f"Candidate {name} has invalid 'age'."}), 400
            if not status:
                return jsonify({"error": f"Candidate {name} is missing 'status'."}), 400
            if not education:
                return jsonify({"error": f"Candidate {name} is missing 'education'."}), 400
            if not party:
                return jsonify({"error": f"Candidate {name} is missing 'party'."}), 400

            # Add valid candidate to the processed list
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

        # Store candidates under election_id
        candidates_storage[election_id] = {
            'candidate': processed_candidates,
            'electionId': election_id
        }

        print(candidates_storage)
        print(type(candidates_storage))

        # Set the election_id in a cookie
        # response = make_response(jsonify({"message": "Candidates added successfully."}), 201)
        # response.set_cookie('election_id', str(election_id))  # Ensure ID is a string for cookies

        # print("Response headers:", response.headers)

        return jsonify({"electionId": election_id},201)

    except Exception as e:
        # Log exception details
        print("Exception Occurred:", str(e))
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route('/api/candidates/list', methods=['GET'])
def get_all_candidates():
    """Retrieve candidates for the election stored in cookies."""
    try:
            
            if(candidates_storage):
                return jsonify(candidates_storage),200
            else:
                return jsonify({"error": "Candidate Data is not found"},404)
        # else:
        #     return jsonify({"error": "Election ID not found."}), 404
    except Exception as e:
        print("Exception Occurred:", str(e))
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
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
    
@app.route('/PastElection', methods=['GET'])
def get_past_elections():
    try:
        current_time = datetime.now(timezone.utc)  # Current UTC time
        app.logger.debug(f"Current UTC time: {current_time}")

        # Fetch all elections
        elections = Election.query.all()
        # print('Past Election Query All',elections)


        # print('Past Election Query All:')
        # for election in elections:
        #     print(f"Election ID: {election.id}, Name: {election.name}, "
        #           f"Start Date: {election.start_date}, End Date: {election.end_date}, "
        #           f"Start Time: {election.start_time}, End Time: {election.end_time}")


        past_elections = []
        for election in elections:
            start_date = election.start_date
            start_time = election.start_time
            end_date = election.end_date
            end_time = election.end_time

            # Combine date and time
            combine_s=f"{start_date} {start_time}"
            dt_st = datetime.strptime(combine_s, "%Y-%m-%d %H:%M:%S")
            timestamp_s = dt_st.timestamp()

            combine_e=f"{end_date} {end_time}"
            dt_en = datetime.strptime(combine_e, "%Y-%m-%d %H:%M:%S")
            timestamp_e = dt_en.timestamp()

            dt_from_timestamp_s = datetime.fromtimestamp(timestamp_s, tz=timezone.utc)
            dt_from_timestamp_e=datetime.fromtimestamp(timestamp_e,tz=timezone.utc)


            start_datetime = datetime.combine(start_date, start_time, tzinfo=timezone.utc)
            end_datetime = datetime.combine(end_date, end_time, tzinfo=timezone.utc)
            
            # print('End Time Stamp',dt_from_timestamp_e)
            # print('Start Time Stamp',dt_from_timestamp_s)
            # print('Current Time Stamp',current_time)

            if current_time > dt_from_timestamp_e:
                party_names = [candidate.party for candidate in election.candidates]

                # Append required fields including start and end timestamps and party names
                past_elections.append({
                    "electionId": election.id,
                    "electionName": election.name,
                    "start_time": start_datetime.isoformat().replace("+00:00", "Z"),  # Ensure Z for UTC
                    "end_time": end_datetime.isoformat().replace("+00:00", "Z"),    # Ensure Z for UTC
                    "party_names": party_names
                })

                print(past_elections)
               

        app.logger.debug(f"Past elections: {past_elections}")

        return jsonify(past_elections), 200


    except Exception as e:
        app.logger.error(f"Error fetching past elections: {str(e)}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        app.logger.error(f"Error starting Flask server: {e}")
