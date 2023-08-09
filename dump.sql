CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
     id SERIAL PRIMARY KEY,
     "userId" INTEGER REFERENCES users(id),
     "userEmail" TEXT REFERENCES users(email),
      token TEXT UNIQUE NOT NULL,
      "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE urls (
     id SERIAL PRIMARY KEY,
     "userId" INTEGER REFERENCES users(id),
      url TEXT NOT NULL,
      "shortUrl" TEXT UNIQUE NOT NULL,
      "visitCount" INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT NOW()
);
