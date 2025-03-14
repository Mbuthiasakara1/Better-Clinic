from server.models import db
class Admin(db.Model):
    __tablename__='admins'

    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(80))
    password =db.Column(db.String(80))
    role=db.Column(db.String(12),default='admin')


    def to_dict(self):
       return {
           "id":self.id,
           "username":self.username,
           "password":self.password,
           "role":self.role
       }