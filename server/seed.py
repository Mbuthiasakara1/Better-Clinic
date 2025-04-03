from app import app
from models import db, User, Question, Session, Response, Payment
from datetime import datetime
import random
import json


# Sample users
users_data = [
    {"gender": "Female", "age_group": "25-34", "relationship_status":"Married"},
    {"gender": "Male", "age_group": "35-44","relationship_status":"Divorced"},
]

# Mental health assessment questions
questions_data = [
    {"question_text": "Little interest or pleasure in doing things", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Feeling down, depressed or hopeless?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Trouble falling or staying asleep, or sleeping too much?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Feeling tired or having little energy?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Poor appetite or overeating?", 
     "category": "Depression", 
     
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Feeling bad about yourself- or that you are a failure or have let yourself or your family down?", 
     "category": "Depression", 
     
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Trouble concentrating on things ,such as reading newspaper or watching television?", 
     "category": "Depression", 
     
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Moving or speaking so slowly that other people could have noticed. Or the opposite- being so fidgety or restless that you have been moving around a lot more than usual?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Thought that you will be better off dead, or of hurting yourself in some way?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Feeling nervous ,anxious  or on edge?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Not being able to stop or control worrying?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Worrying too much about different things?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Trouble relaxing?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Being so restless that it is hard to sit still?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Becoming easily annoyed or irritable?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
    {"question_text": "Feeling afraid as if something awful might happen?", 
     "category": "Anxiety", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},
]
def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        # Add questions
        questions = [Question(**q) for q in questions_data]
        db.session.add_all(questions)
        db.session.commit()


        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
