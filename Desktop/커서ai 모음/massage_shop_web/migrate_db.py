import sqlite3
from app import app, db, Customer, Therapist, Reservation, ManagementRecord
from datetime import datetime

def migrate_data():
    # 기존 데이터베이스 연결
    old_conn = sqlite3.connect('massage_shop.db')
    old_cursor = old_conn.cursor()

    # 새 데이터베이스 컨텍스트 생성
    with app.app_context():
        # 테이블 생성
        db.create_all()

        # 고객 데이터 마이그레이션
        print("고객 데이터 마이그레이션 중...")
        old_cursor.execute("SELECT id, name, phone, birth_date, join_date, memo FROM customers")
        customers = old_cursor.fetchall()
        for customer in customers:
            new_customer = Customer(
                id=customer[0],
                name=customer[1],
                phone=customer[2],
                birth_date=customer[3],
                join_date=customer[4],
                memo=customer[5]
            )
            db.session.add(new_customer)
        db.session.commit()
        print(f"{len(customers)}명의 고객 데이터 마이그레이션 완료")

        # 관리사 데이터 마이그레이션
        print("관리사 데이터 마이그레이션 중...")
        old_cursor.execute("SELECT id, name, active FROM therapists")
        therapists = old_cursor.fetchall()
        for therapist in therapists:
            new_therapist = Therapist(
                id=therapist[0],
                name=therapist[1],
                active=bool(therapist[2])
            )
            db.session.add(new_therapist)
        db.session.commit()
        print(f"{len(therapists)}명의 관리사 데이터 마이그레이션 완료")

        # 예약 데이터 마이그레이션
        print("예약 데이터 마이그레이션 중...")
        old_cursor.execute("""
            SELECT id, customer_id, reservation_date, start_time, therapist, 
                   massage_type, massage_duration, designation, memo 
            FROM reservations
        """)
        reservations = old_cursor.fetchall()
        for reservation in reservations:
            new_reservation = Reservation(
                id=reservation[0],
                customer_id=reservation[1],
                reservation_date=reservation[2],
                start_time=reservation[3],
                therapist=reservation[4],
                massage_type=reservation[5],
                massage_duration=reservation[6],
                designation=reservation[7],
                memo=reservation[8]
            )
            db.session.add(new_reservation)
        db.session.commit()
        print(f"{len(reservations)}개의 예약 데이터 마이그레이션 완료")

        # 관리 기록 데이터 마이그레이션
        print("관리 기록 데이터 마이그레이션 중...")
        old_cursor.execute("""
            SELECT id, customer_id, record_date, massage_type, 
                   massage_duration, memo, start_time 
            FROM management_records
        """)
        records = old_cursor.fetchall()
        for record in records:
            new_record = ManagementRecord(
                id=record[0],
                customer_id=record[1],
                record_date=record[2],
                massage_type=record[3],
                massage_duration=record[4],
                memo=record[5],
                start_time=record[6]
            )
            db.session.add(new_record)
        db.session.commit()
        print(f"{len(records)}개의 관리 기록 데이터 마이그레이션 완료")

    # 기존 데이터베이스 연결 종료
    old_conn.close()
    print("데이터베이스 마이그레이션이 완료되었습니다.")

if __name__ == "__main__":
    migrate_data() 