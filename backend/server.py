from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin, BaseView, expose
from flask_admin.contrib.sqla import ModelView
import os
import cv2
import face_recognition
import mysql.connector
import numpy as np
import base64

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:aarati123@localhost/voting_system'
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)
admin = Admin(app, name='Voting Admin', template_mode='bootstrap3')
CORS(app)

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    party = db.Column(db.String(50), nullable=False)
    photo_url = db.Column(db.String(200), nullable=False)
    votes = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()

# Custom Admin view for Candidate to exclude votes
class CandidateView(ModelView):
    form_excluded_columns = ['votes']  # Exclude 'votes' column from the form

admin.add_view(CandidateView(Candidate, db.session))

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    candidates = Candidate.query.all()
    result = [
        {
            "id": candidate.id,
            "name": candidate.name,
            "party": candidate.party,
            "photo_url": candidate.photo_url
        } for candidate in candidates
    ]
    return jsonify(result)

@app.route('/api/vote', methods=['POST'])
def vote():
    data = request.json
    candidate_id = data['candidate_id']

    candidate = Candidate.query.get(candidate_id)
    if candidate:
        candidate.votes += 1
        db.session.commit()
        return jsonify({"message": "Vote counted"}), 200
    else:
        return jsonify({"message": "Candidate not found"}), 404

@app.route('/')
def home():
    return "Welcome to the Voting System API"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    frame_data = data['frame']
    voter_id = data['voter_id']
    
    imgdata = base64.b64decode(frame_data.split(',')[1])
    nparr = np.frombuffer(imgdata, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    face_locations = face_recognition.face_locations(img)
    if len(face_locations) != 1:
        return jsonify({"message": "Please ensure only one face is visible for registration."})

    face_encoding = face_recognition.face_encodings(img, face_locations)[0]
    face_encoding_bytes = face_encoding.tobytes()

    connection = connect_db()
    if connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM voters WHERE voter_id = %s", (voter_id,))
        result = cursor.fetchone()
        if result:
            cursor.close()
            connection.close()
            return jsonify({"message": "Voter ID is already registered."})

        cursor.execute("INSERT INTO voters (voter_id, face_encoding) VALUES (%s, %s)", (voter_id, face_encoding_bytes))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Registration successful"})
    else:
        return jsonify({"message": "Database connection failed"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    frame_data = data['frame']
    voter_id = data['voter_id']
    
    imgdata = base64.b64decode(frame_data.split(',')[1])
    nparr = np.frombuffer(imgdata, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    face_locations = face_recognition.face_locations(img)
    if len(face_locations) != 1:
        return jsonify({"message": "Please ensure only one face is visible for login."})

    login_face_encoding = face_recognition.face_encodings(img, face_locations)[0]

    connection = connect_db()
    if connection:
        cursor = connection.cursor()
        cursor.execute("SELECT face_encoding FROM voters WHERE voter_id = %s", (voter_id,))
        result = cursor.fetchone()
        if result:
            db_face_encoding = np.frombuffer(result[0], dtype=np.float64)
            matches = face_recognition.compare_faces([db_face_encoding], login_face_encoding)
            if matches[0]:
                cursor.close()
                connection.close()
                return jsonify({"message": "Login successful"})
            else:
                cursor.close()
                connection.close()
                return jsonify({"message": "Face did not match. Login failed."})
        else:
            cursor.close()
            connection.close()
            return jsonify({"message": "Voter ID not found in the database."})
    else:
        return jsonify({"message": "Database connection failed"})

def connect_db():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="aarati123",
            database="voting_system"
        )
        return connection
    except mysql.connector.Error as e:
        print(f"Database connection failed: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)
