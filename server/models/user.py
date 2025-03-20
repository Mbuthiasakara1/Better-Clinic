from models import db

class User(db.Model):
    __tablename__ ="users"

    id =db.Column(db.Integer,primary_key=True)  
    gender =db.Column(db.String(20),nullable=False)
    age_group =db.Column(db.String(20),nullable=False)
    relationship_status =db.Column(db.String(20),nullable=False)
    created_at = db.Column(db.DateTime,default=db.func.current_timestamp())

    #relationship
    sessions=db.relationship('Session',back_populates='user',cascade='all,delete-orphan')


    def __repr__(self):
        return f"<User {self.first_name},{self.last_name}, Email : {self.email}  >  "

    def to_dict(self):
        return{
            "id":self.id,
            "gender":self.gender,
            "relationship_status": self.relationship_status,
            "age_group":self.age_group,
            "sessions": [session.to_dict() for session in self.sessions],  
            "created_at":self.created_at.isoformat() if self.created_at else None,
        }

    
