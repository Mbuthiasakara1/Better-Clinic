from questions import Question
from faker import Faker
from app import app

fake=Faker()

with app.app_context():
    print('Clear questions table..')
    Question.query.delete()
    
    
