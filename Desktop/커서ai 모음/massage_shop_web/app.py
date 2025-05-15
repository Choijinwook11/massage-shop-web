from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///massage_shop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

db = SQLAlchemy(app)
jwt = JWTManager(app)

# 모델 정의
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    birth_date = db.Column(db.String(10))
    join_date = db.Column(db.String(10))
    memo = db.Column(db.Text)

class Therapist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean, default=True)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    reservation_date = db.Column(db.String(10), nullable=False)
    start_time = db.Column(db.String(5), nullable=False)
    therapist = db.Column(db.String(100), nullable=False)
    massage_type = db.Column(db.String(50), nullable=False)
    massage_duration = db.Column(db.String(20), nullable=False)
    designation = db.Column(db.String(20))
    memo = db.Column(db.Text)
    customer = db.relationship('Customer', backref=db.backref('reservations', lazy=True))

class ManagementRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    record_date = db.Column(db.String(10), nullable=False)
    massage_type = db.Column(db.String(50), nullable=False)
    massage_duration = db.Column(db.String(20), nullable=False)
    memo = db.Column(db.Text)
    start_time = db.Column(db.String(5))
    customer = db.relationship('Customer', backref=db.backref('management_records', lazy=True))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='admin')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# 라우트 정의
@app.route('/api/customers', methods=['GET'])
@jwt_required()
def get_customers():
    customers = Customer.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'phone': c.phone,
        'birth_date': c.birth_date,
        'join_date': c.join_date,
        'memo': c.memo
    } for c in customers])

@app.route('/api/customers', methods=['POST'])
@jwt_required()
def create_customer():
    data = request.get_json()
    customer = Customer(
        name=data['name'],
        phone=data.get('phone'),
        birth_date=data.get('birth_date'),
        join_date=data.get('join_date'),
        memo=data.get('memo')
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify({'id': customer.id}), 201

@app.route('/api/customers/<int:customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.birth_date = data.get('birth_date', customer.birth_date)
    customer.join_date = data.get('join_date', customer.join_date)
    customer.memo = data.get('memo', customer.memo)
    
    db.session.commit()
    return jsonify({'message': 'Customer updated successfully'})

@app.route('/api/customers/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Customer deleted successfully'})

@app.route('/api/reservations', methods=['GET'])
@jwt_required()
def get_reservations():
    date = request.args.get('date')
    if date:
        reservations = Reservation.query.filter_by(reservation_date=date).all()
    else:
        reservations = Reservation.query.all()
    
    return jsonify([{
        'id': r.id,
        'customer_id': r.customer_id,
        'customer_name': r.customer.name,
        'reservation_date': r.reservation_date,
        'start_time': r.start_time,
        'therapist': r.therapist,
        'massage_type': r.massage_type,
        'massage_duration': r.massage_duration,
        'designation': r.designation,
        'memo': r.memo
    } for r in reservations])

@app.route('/api/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    data = request.get_json()
    reservation = Reservation(
        customer_id=data['customer_id'],
        reservation_date=data['reservation_date'],
        start_time=data['start_time'],
        therapist=data['therapist'],
        massage_type=data['massage_type'],
        massage_duration=data['massage_duration'],
        designation=data.get('designation'),
        memo=data.get('memo')
    )
    db.session.add(reservation)
    db.session.commit()
    return jsonify({'id': reservation.id}), 201

@app.route('/api/therapists', methods=['GET'])
@jwt_required()
def get_therapists():
    therapists = Therapist.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'active': t.active
    } for t in therapists])

@app.route('/api/therapists', methods=['POST'])
@jwt_required()
def create_therapist():
    data = request.get_json()
    therapist = Therapist(
        name=data['name'],
        active=data.get('active', True)
    )
    db.session.add(therapist)
    db.session.commit()
    return jsonify({'id': therapist.id}), 201

@app.route('/api/management-records', methods=['GET'])
@jwt_required()
def get_management_records():
    customer_id = request.args.get('customer_id')
    if customer_id:
        records = ManagementRecord.query.filter_by(customer_id=customer_id).all()
    else:
        records = ManagementRecord.query.all()
    
    return jsonify([{
        'id': r.id,
        'customer_id': r.customer_id,
        'customer_name': r.customer.name,
        'record_date': r.record_date,
        'massage_type': r.massage_type,
        'massage_duration': r.massage_duration,
        'memo': r.memo,
        'start_time': r.start_time
    } for r in records])

@app.route('/api/management-records', methods=['POST'])
@jwt_required()
def create_management_record():
    data = request.get_json()
    record = ManagementRecord(
        customer_id=data['customer_id'],
        record_date=data['record_date'],
        massage_type=data['massage_type'],
        massage_duration=data['massage_duration'],
        memo=data.get('memo'),
        start_time=data.get('start_time')
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'id': record.id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify({
            'token': access_token,
            'role': user.role
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# 초기 관리자 계정 생성
def create_admin_user():
    with app.app_context():
        # 기존 admin 계정이 있으면 삭제
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            db.session.delete(existing_admin)
            db.session.commit()
        
        # 새로운 admin 계정 생성
        admin = User(username='admin', role='admin')
        admin.set_password('admin@123456789')  # 비밀번호를 admin@123456789로 변경
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")  # 디버그용 출력

if __name__ == '__main__':
    # 데이터베이스 초기화
    with app.app_context():
        db.create_all()
        create_admin_user()  # admin 계정 생성
    app.run(debug=True) 