from models import db
from datetime import datetime
class Session(db.Model):
    __tablename__="sessions"

    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    score=db.Column(db.Float,nullable=True)
    paid=db.Column(db.Boolean,default=False)
    result_sent=db.Column(db.Boolean,default=False)
    created_at = db.Column(db.DateTime,default=db.func.current_timestamp())
    completed_at=db.Column(db.DateTime,nullable=True)

    #relationship
    user=db.relationship('User',back_populates='sessions')
    payment = db.relationship('Payment', back_populates='session')
    responses = db.relationship('Response', back_populates='session', cascade='all, delete-orphan')




    def to_dict(self):
        return {
            "id":self.id,
            "user_id":self.user_id,
            "score":self.score,
            "paid":self.paid,
            "result_sent":self.result_sent,
            "created_at":self.created_at.isoformat() if self.created_at else None,
            "completed_at":self.completed_at.utcnow() if self.completed_at else None,
        }
    
    
    def __repr__(self):
        return f"<Session {self.id} for User {self.user_id}>"
    
    def complete_assesment(self,score):
        self.score = score
        self.completed_at =datetime.utcnow()

    def mark_as_paid(self):
        self.paid=True  

        
