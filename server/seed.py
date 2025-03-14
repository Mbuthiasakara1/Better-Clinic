from app import app
from models import db, User, Question, Session, Response, Payment
from datetime import datetime
import random
import json


# Sample users
users_data = [
    {"first_name": "Alice", "last_name": "Johnson", "email": "alice@example.com", "gender": "Female", "age_group": "25-34", "mobile_number": 1234567890},
    {"first_name": "Bob", "last_name": "Smith", "email": "bob@example.com", "gender": "Male", "age_group": "35-44", "mobile_number": 2345678901},
]

# Mental health assessment questions
questions_data = [
    {"question_text": "How often do you feel nervous, anxious, or on edge?", 
     "category": "Anxiety", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "How often do you feel down, depressed, or hopeless?", 
     "category": "Depression", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you have trouble falling asleep or staying asleep?", 
     "category": "Sleep Issues", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you experience excessive worry about different aspects of life?", 
     "category": "Anxiety", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you often feel overwhelmed by your responsibilities?", 
     "category": "Stress", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you find it difficult to focus or concentrate?", 
     "category": "Cognitive Function", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you experience sudden feelings of panic or fear?", 
     "category": "Panic Disorder", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you avoid social situations due to anxiety?", 
     "category": "Social Anxiety", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "How often do you feel tired or have low energy?", 
     "category": "Fatigue", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])},

    {"question_text": "Do you feel like you are not enjoying activities you once loved?", 
     "category": "Depression", 
     "question_type": "multiple_choice", 
     "options": json.dumps([
         {"text": "Never", "score": 0},
         {"text": "Rarely", "score": 1},
         {"text": "Sometimes", "score": 2},
         {"text": "Often", "score": 3},
         {"text": "Always", "score": 4}
     ])}
]
def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Add users
        users = [User(**user) for user in users_data]
        db.session.add_all(users)
        db.session.commit()

        # Add questions
        questions = [Question(**q) for q in questions_data]
        db.session.add_all(questions)
        db.session.commit()

        # Add sample sessions and responses
        for user in users:
            session = Session(user_id=user.id, score=random.uniform(10, 100))
            db.session.add(session)
            db.session.commit()

            for question in questions:
                response = Response(
                    session_id=session.id,
                    question_id=question.id,
                    response_value=random.choice(["Never", "Rarely", "Sometimes", "Often", "Always"])
                )
                db.session.add(response)

            # Add a sample payment
            payment = Payment(session_id=session.id, amount=100.00, currency="KES", status="completed", payment_date=datetime.utcnow())
            db.session.add(payment)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
