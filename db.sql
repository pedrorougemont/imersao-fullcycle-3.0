CREATE TABLE credit_cards (
    id uuid NOT NULL,
    name VARCHAR NOT NULL,
    number VARCHAR NOT NULL,
    expiration_month INTEGER NOT NULL,
    expiration_year INTEGER,
    CVV VARCHAR NOT NULL,
    balance FLOAT NOT NULL,
    balance_limit FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE transactions (
    id uuid NOT NULL,
    credit_card_id uuid NOT NULL REFERENCES credit_cards(id),
    amount FLOAT NOT NULL,
    status VARCHAR NOT NULL,
    description VARCHAR,
    store VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);