CREATE TABLE books (
    Id          int IDENTITY(1,1) PRIMARY KEY,
    ISBN        int,
    Copies      int,
    BookTitle   varchar(128)
);

CREATE TABLE users (
    Id          int IDENTITY(1,1) PRIMARY KEY,
    Username    varchar(128)
);

CREATE TABLE authors (
    Id          int IDENTITY(1,1) PRIMARY KEY,
	FirstName	varchar(128),
	Surname		varchar(128)
);

CREATE TABLE books_authors (
    Id          int IDENTITY(1,1) PRIMARY KEY,
	Author_Id   int,
    Book_Id     int,
    FOREIGN KEY (Author_Id) REFERENCES authors(Id),
    FOREIGN KEY (Book_Id) REFERENCES books(Id),
)

CREATE TABLE books_users (
    Id          int IDENTITY(1,1) PRIMARY KEY,
	Users_Id    int,
    Book_Id     int,
	DueDate		date,
	Returned	BIT,
    FOREIGN KEY (Users_Id) REFERENCES users(Id),
    FOREIGN KEY (Book_Id) REFERENCES books(Id),
)