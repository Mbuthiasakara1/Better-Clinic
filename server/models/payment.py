from models import db
from datetime import datetime 

class Payment(db.Model):
    __tablename__="payments"

    id=db.Column(db.Integer,primary_key=True)
    session_id=db.Column(db.Integer,db.ForeignKey('sessions.id'),nullable=False)
    amount=db.Column(db.Numeric(10,2),nullable=False,default=100.00)
    currency=db.Column(db.String(3))
    transaction_id=db.Column(db.String(100),unique=True,nullable=True)
    phone_number = db.Column(db.String(20))
    email_address = db.Column(db.String(100))
    status=db.Column(db.String(20),default='pending')
    payment_date=db.Column(db.DateTime,nullable=True)
    created_at=db.Column(db.DateTime,default=datetime.utcnow)
    
    
    #relationship
    session = db.relationship('Session', back_populates='payment')

    def mark_as_successful(self, transaction_id):
        self.status = 'completed'
        self.transaction_id = transaction_id
        self.payment_date = datetime.utcnow()
        self.session.mark_as_paid()

    def __repr__(self):
        return f"<Payment {self.id}: {self.amount} {self.currency} - {self.status}>" 