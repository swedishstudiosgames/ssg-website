from faker import Faker
import sqlite3

# Create a connection to the database
conn = sqlite3.connect('user_database.db')
cursor = conn.cursor()

# Create the users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT
    )
''')

# Generate fake user data and insert into the users table
fake = Faker()
num_users = 10000  # Set the desired number of fake users

for _ in range(num_users):
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = fake.email()
    phone = fake.phone_number()
    address = fake.address().replace("\n", ", ")

    cursor.execute('''
        INSERT INTO users (first_name, last_name, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
    ''', (first_name, last_name, email, phone, address))

# Commit changes and close the connection
conn.commit()
conn.close()
