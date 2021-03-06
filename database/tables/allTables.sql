CREATE TABLE Artists(
    artistID SERIAL PRIMARY KEY,
    artistName VARCHAR(160),
    followed Boolean,
    followedNumber int,
    verified Boolean,
    Biography VARCHAR(1000),
    imagesarr JSON
);

CREATE TABLE Cities(
    cityID INTEGER PRIMARY KEY, 
    city VARCHAR(160)
);

CREATE TABLE CitiesJoin (
    artistID INTEGER references Artists(artistID),
    cityID INTEGER references Cities(cityID),
    followers INTEGER
);

CREATE TABLE artistImagesArray (
    artistID INTEGER references Artists(artistID),
    imageArr text
)