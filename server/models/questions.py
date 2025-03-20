from models import db
import json

class Question (db.Model):
    __tablename__ ="questions"
    
    id =db.Column(db.Integer,primary_key=True,autoincrement=True)
    question_text=db.Column(db.Text,nullable=False)
    category=db.Column(db.String(100),nullable=False)
    options = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime,default=db.func.current_timestamp())

    responses = db.relationship('Response', back_populates='question')


    def __repr__(self):
        return f"<Question{self.question_text},Category{self.category}>"
    
    def to_dict(self):
        try:
            return {
                "id": self.id,
                "question_text": self.question_text,
                "category": self.category,
                "options": json.loads(self.options) if self.options and self.options.strip() else [],
                "created_at": self.created_at.isoformat(),
            }
        except json.JSONDecodeError:
            return {
                "id": self.id,
                "question_text": self.question_text,
                "category": self.category,
                "question_type": self.question_type,
                "options": [],  
                "created_at": self.created_at.isoformat(),
            }
