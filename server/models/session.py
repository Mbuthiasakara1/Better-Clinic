from models import db
from datetime import datetime
import json

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
    payment = db.relationship('Payment', back_populates='session', cascade="all, delete")
    responses = db.relationship('Response', back_populates='session', cascade='all, delete-orphan')


    
    def calculate_scores(self):
        """Calculate total percentage score per category."""
        category_scores = {}
        category_max_scores = {}

        for response in self.responses:
            db.session.refresh(response) 
            db.session.refresh(response.question) 

            question = response.question
            if not question:
                continue  

            options = json.loads(question.options) 
            max_score = max(option["score"] for option in options)  

            if question.category not in category_scores:
                category_scores[question.category] = 0
                category_max_scores[question.category] = 0

            # Find the score of the selected option
            selected_score = next(
                (option["score"] for option in options if option["text"] == response.response_value), 
                0  
            )

            category_scores[question.category] += float(selected_score) 
            category_max_scores[question.category] += float(max_score)  

        # Convert scores to percentage
        category_percentages = {
            category: (category_scores[category] / category_max_scores[category]) * 100
            for category in category_scores
        }
        return category_percentages



    def get_assessment_result(self):
        """Determine severity per category based on percentage scores."""
        category_scores = self.calculate_scores()

        if not category_scores:
            return {"message": "No scores available for this session"}

        severity_levels = {
            "Normal": (0, 39.9),
            "Mild": (40, 59.9),
            "Moderate": (60, 79.9),
            "Severe": (80, 100),
        }

        highest_category = max(category_scores, key=category_scores.get)
        highest_score = category_scores[highest_category]

        severity = "Unknown"
        for level, (low, high) in severity_levels.items():
            if low <= highest_score <= high:
                severity = level
                break

        
        if severity == "Normal":
            message = (
                f"Your {highest_category.lower()} score is {round(highest_score, 1)}%. "
                "This is within the normal range. You currently show no significant symptoms requiring concern."
            )
        else:
            message = (
                f"Your {highest_category.lower()} score is {round(highest_score, 1)}%. "
                f"This indicates {severity.lower()} symptoms of {highest_category.lower()}. "
                "It is recommended that you consult with a mental health professional for further evaluation and support."
            )

        return {
            "category": highest_category,
            "score": round(highest_score, 1),
            "severity": severity,
            "message": message
        }


    def __repr__(self):
        return f"<Session {self.id} for User {self.user_id}>"
    
    def complete_assesment(self,score):
        self.score = score
        self.completed_at =datetime.utcnow()

    def mark_as_paid(self):
        self.paid=True  

        
    def to_dict(self):
        result = self.get_assessment_result()

        return {
            "id": self.id,
            "user_id": self.user_id,
            "score": self.score,
            "paid": self.paid,
            "result_sent": self.result_sent,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "category": result["category"] if result else None,
            "severity": result["severity"] if result else None,
            "message": result["message"] if result else None,
        }
