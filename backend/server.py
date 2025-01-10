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
from datetime import datetime
from wtforms import SelectField
from flask import session
from flask_admin import expose

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:anu123@localhost/voting_system'
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


logging.basicConfig(level=logging.DEBUG)

db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:3000"], allow_headers=["Content-Type"], supports_credentials=True)


class Voter(db.Model):
    voter_id = db.Column(db.String(255), primary_key=True)
    face_encoding = db.Column(db.LargeBinary, nullable=False)

class Election(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    winner = db.Column(db.String(255), nullable=True)
    result_link = db.Column(db.String(255), nullable=True)
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


with app.app_context():
    db.create_all()


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
    column_exclude_list = ['face_encoding']  
    form_columns = ['voter_id', 'face_encoding']  
    
    def is_accessible(self):
        
        return True

    def inaccessible_callback(self, name, **kwargs):
        
        return super().inaccessible_callback(name, **kwargs)


class ElectionModelView(ModelView):
    inline_models = [Candidate]

admin = Admin(app, name='Election Admin', template_mode='bootstrap3')
admin.add_view(CandidateModelView(Candidate, db.session))
admin.add_view(ElectionModelView(Election, db.session))
admin.add_view(VoterModelView(Voter, db.session)) 

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        frame_data = data['frame']
        voter_id = data['voter_id']

        
        imgdata = base64.b64decode(frame_data.split(',')[1])
        nparr = np.frombuffer(imgdata, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        face_locations = face_recognition.face_locations(img)
        if len(face_locations) != 1:
            return jsonify({"message": "Please ensure only one face is visible for registration."}), 400

        face_encoding = face_recognition.face_encodings(img, face_locations)[0]
        face_encoding_bytes = face_encoding.tobytes()

        
        voter = Voter.query.filter_by(voter_id=voter_id).first()
        if voter:
            return jsonify({"message": "Voter ID is already registered."}), 400

        
        new_voter = Voter(voter_id=voter_id, face_encoding=face_encoding_bytes)
        db.session.add(new_voter)
        db.session.commit()
        session['voter_id'] = voter_id
        return jsonify({"message": "Registration successful,and you are now logged in!"}), 200
    except Exception as e:
        app.logger.error(f"Error during registration: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        frame_data = data['frame']
        voter_id = data['voter_id']
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
                session['voter_id'] = voter_id
                return jsonify({"message": "Login successful"}), 200
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
        
        session.pop('voter_id', None)
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error during logout: {str(e)}")
        return jsonify({"error": str(e)}), 500



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
                    "winner": election.winner or "TBD",
                    "result_link": election.result_link or "No link available",
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
            'votes': candidate.votes,
            'age': candidate.age,  
            'status': candidate.status,  
            'education': candidate.education,
            'party': candidate.party  
        } for candidate in candidates]), 200
    except Exception as e:
        app.logger.error(f"Error fetching candidates: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/election/<int:election_id>/candidates', methods=['GET'])
def get_candidates_by_election(election_id):
    try:
        
        election = Election.query.filter_by(id=election_id).first()
        if not election:
            return jsonify({"message": "Election not found"}), 404

        
        candidates = Candidate.query.filter_by(election_id=election_id).all()
        if not candidates:
            return jsonify({"message": "No candidates found for this election"}), 404

        
        response = {
            "election_id": election.id,
            "election_name": election.name,
            "start_date": election.start_date.strftime("%Y-%m-%d"),
            "start_time": election.start_time.strftime("%H:%M:%S"),
            "end_date": election.end_date.strftime("%Y-%m-%d"),
            "end_time": election.end_time.strftime("%H:%M:%S"),
            "candidates": [
                {
                    "id": candidate.id,
                    "name": candidate.name,
                    "manifesto": candidate.manifesto,
                    "photo_url": candidate.photo_url,
                    "votes": candidate.votes,
                    "age": candidate.age,
                    "status": candidate.status,
                    "education": candidate.education,
                    "party": candidate.party,
                }
                for candidate in candidates
            ],
        }
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(f"Error fetching candidates for election {election_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500


candidates_storage = []

@app.route('/api/candidates/list', methods=['POST'])
def add_candidates():
    try:
       
        data = request.json

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
                'election_id':election_id
            })

        candidates_storage.append({
            'candidate': processed_candidates,
            'electionId': election_id,
            'electionName': election_name
        })

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


if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        app.logger.error(f"Error starting Flask server: {e}")