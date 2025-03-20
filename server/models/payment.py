from models import db
from datetime import datetime 

class Payment(db.Model):
    __tablename__="payments"

    id=db.Column(db.Integer,primary_key=True)#unique id
    session_id=db.Column(db.Integer,db.ForeignKey('sessions.id'),nullable=False,unique=True)#one session can only have one payment
    amount=db.Column(db.Numeric(10,2),nullable=False,default=100.00)#amount paid defaults to 100ksh
    currency=db.Column(db.String(3),default='KES')#currency in ksh
    transaction_id=db.Column(db.String(100),unique=True,nullable=True)# Unique transaction code from M-PESA (like "TC66NVJ4TA")
    status=db.Column(db.String(20),default='pending')# Payment status: pending, completed, failed
    payment_date=db.Column(db.DateTime,nullable=True)#time the payment was confirmed
    created_at=db.Column(db.DateTime,default=datetime.utcnow)#timestamp for when the record was created
    
    #relationship
    session = db.relationship('Session', back_populates='payment')

    def mark_as_successful(self, transaction_id):
        self.status = 'completed'
        self.transaction_id = transaction_id
        self.payment_date = datetime.utcnow()
        self.session.mark_as_paid()

    def __repr__(self):
        return f"<Payment {self.id}: {self.amount} {self.currency} - {self.status}>" 