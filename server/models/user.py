from ..config import db

class User(db.Model):
    __tablename__ ="users"

    id =db.Column(db.Integer,primary_key=True)  
    first_name=db.Column(db.String(50),nullable=False)  
    last_name=db.Column(db.String(50),nullable=False)  
    email=db.Column(db.String(50),unique=True, nullable=False)
    gender =db.Column(db.String(20),nullable=False)
    mobile_number=db.Column(db.Integer,nullable=False,unique=True)
    created_at = db.Column(db.DateTime,default=db.func.current_timestamp())

    #relationship
    sessions=db.relationship('Session',back_populates='user',cascade='all,delete-orphan')


    def __repr__(self):
        return f"<User {self.first_name},{self.last_name}, Email : {self.email}  >  "

    def to_dict(self):
        return{
            "id":self.id,
            "first_name":self.first_name,
            "last_name":self.last_name,
            "email":self.email,
            "gender":self.gender,
            "mobile_number":self.mobile_number,
            "created_at":self.created_at.isoformat() if self.created_at else None,
        }

    
