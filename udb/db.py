import sqlite3
from faker import Faker

# Create a connection to the database
conn = sqlite3.connect('honeypot_database.db')
cursor = conn.cursor()

# Create a table to store fake product data
cursor.execute('''
    CREATE TABLE fake_products (
        id INTEGER PRIMARY KEY,
        product_name TEXT,
        price REAL,
        availability TEXT,
        description TEXT
    )
''')

# Create a table to store fake user data
cursor.execute('''
    CREATE TABLE fake_users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT
    )
''')

# Generate and insert fake product data into the database
fake = Faker()
for _ in range(10):
    product_name = fake.catch_phrase()
    price = fake.random_int(min=1000, max=100000)
    availability = fake.random_element(elements=('In Stock', 'Out of Stock', 'Limited Stock', 'Pre-order'))
    description = fake.paragraph(nb_sentences=3)

    cursor.execute('''
        INSERT INTO fake_products (product_name, price, availability, description)
        VALUES (?, ?, ?, ?)
    ''', (product_name, price, availability, description))

# Generate and insert fake user data into the database
for _ in range(2):
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = fake.email()
    phone = fake.phone_number()
    address = fake.address().replace("\n", ", ")

    cursor.execute('''
        INSERT INTO fake_users (first_name, last_name, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
    ''', (first_name, last_name, email, phone, address))

# Commit changes and close the connection
conn.commit()
conn.close()
