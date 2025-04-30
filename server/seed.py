from app import app
from models import db,Question, Admin
from datetime import datetime
import random
import json


# Mental health assessment questions
questions_data = [
    {"question_text": "Do you have little interest or pleasure in doing things?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    {"question_text": "Do you feel down, depressed, or hopeless?", 
     "category": "Depression", 
     "options": json.dumps([
         {"text": "Not At all", "score": 0},
         {"text": "Several days", "score": 1},
         {"text": "More than half the day", "score": 2},
         {"text": "Nearly Everyday", "score": 3}
     ])},

    # {"question_text": "Are you experiencing trouble falling or staying asleep, or sleeping too much?", 
    #  "category": "Depression", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Do you feel tired or have little energy?", 
    #  "category": "Depression", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text":"Are you experiencing poor appetite or overeating?", 
    #  "category": "Depression", 
     
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Do you feel bad about yourself - or that you are a failure or have let yourself or your family down?", 
    #  "category": "Depression", 
     
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Do you have trouble concentrating on things, such as reading a newspaper or watching television?", 
    #  "category": "Depression", 
     
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Are you moving or speaking so slowly that other people could have noticed?", 
    #  "category": "Depression", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Have you had thoughts that you would be better off dead, or of hurting yourself in some way?", 
    #  "category": "Depression", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},

    # {"question_text": "Do you feel nervous, anxious, or on edge?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Are you unable to stop or control worrying?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Are you worrying too much about different things?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Do you have trouble relaxing?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Are you so restless that it is hard to sit still?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Do you become easily annoyed or irritable?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
    # {"question_text": "Do you feel afraid, as if something awful might happen?", 
    #  "category": "Anxiety", 
    #  "options": json.dumps([
    #      {"text": "Not At all", "score": 0},
    #      {"text": "Several days", "score": 1},
    #      {"text": "More than half the day", "score": 2},
    #      {"text": "Nearly Everyday", "score": 3}
    #  ])},
]

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        # Create admin users
        admin1 = Admin(username="admin1")
        admin1.set_password("password123")

        admin2 = Admin(username="admin2")
        admin2.set_password("securepass456")

        db.session.add_all([admin1, admin2])
        
        # Add questions
        questions = [Question(**q) for q in questions_data]
        db.session.add_all(questions)
        db.session.commit()


        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
