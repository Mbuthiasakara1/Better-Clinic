from models import db
from datetime import datetime

class Response(db.Model):
    __tablename__="responses"

    id=db.Column(db.Integer,primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    response_value=db.Column(db.Text,nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow)
    

    #relationship
    session =db.relationship('Session',back_populates='responses')
    question=db.relationship('Question',back_populates='responses')

    def __repr__(self):
        return f"<Response {self.id} for {self.session_id}>"


    def to_dict(self):
        return{
            "id":self.id,
            "session_id":self.session_id,
            "question_id":self.question_id,
            "response_value":self.response_value
        }