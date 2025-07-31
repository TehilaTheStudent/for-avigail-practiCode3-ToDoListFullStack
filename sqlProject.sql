CREATE TABLE Items (
    Id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(100),
    IsComplete TINYINT(1),
    PRIMARY KEY (Id)
);

-- Users table for JWT authentication
CREATE TABLE Users (
    Id INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (Id)
);

SHOW DATABASES;




