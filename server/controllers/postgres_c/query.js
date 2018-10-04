const client = require('../../../database/postgres/databaseConnection.js');
const cities = require('./citySort.js');
client.connect();

exports.getData = (req, res) => {
  let artist = req.params.artistID;
  let artistResponse = {
    artistImages: null,
    artistName: null,
    followed: null,
    verified: null,
    followersNumber: null,
    about: {
      biography: null,
      where: null,
    },
  };
  client.query(
    `SELECT artistname, followed, verified, biography, imagearr \
    FROM artists \
    INNER JOIN imagesarray on imagesarray.artistid = artists.artistid \
    WHERE artists.artistid = ${artist};`,
    (err, resp) => {
      if (err) {
        res.status(500).send(err, ' there was an error somewhere');
      }
      artistResponse.artistName = resp.rows[0].artistName;
      artistResponse.artistImages = JSON.parse(
        '["https://s3-us-west-1.amazonaws.com/imagesforartist/images/557.jpeg","https://s3-us-west-1.amazonaws.com/imagesforartist/images/625.jpeg","https://s3-us-west-1.amazonaws.com/imagesforartist/images/192.jpeg","https://s3-us-west-1.amazonaws.com/imagesforartist/images/847.jpeg"]',
      );
      artistResponse.followed = resp.rows[0].followed;
      artistResponse.verified = resp.rows[0].verified;
      artistResponse.about.biography = resp.rows[0].biography;
      client.query(
        `SELECT city, followers \
        FROM cities \
        INNER JOIN citiesjoin on cities.cityid = citiesjoin.cityid \
        WHERE citiesjoin.artistid = ${artist}
        ORDER BY followers DESC;`,
        (err, resp) => {
          if (err) {
            res
              .status(500)
              .send(err, ' there was an error in the cities piece');
          }
          let top = cities.sorter(resp.rows);
          artistResponse.about.where = top[0];
          artistResponse.followersNumber = top[1];
          res.status(201).send(artistResponse);
        },
      );
    },
  );
};

exports.postData = (req, res) => {
  let artist = [req.body];
  client.query(
    `INSERT INTO artists(artistname, followed, verified, biography) VALUES($1, $2, $3, $4)`,
    artist,
    (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        res.status(201).send(resp.rows[0]);
      }
    },
  );
};