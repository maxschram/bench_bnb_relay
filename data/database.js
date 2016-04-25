import Sequelize from 'sequelize';

const sequelize = new Sequelize('bench_bnb_development', 'mbs', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const Bench = sequelize.define('bench', {
  description: {
    type: Sequelize.STRING,
  },
  lat: {
    type: Sequelize.FLOAT
  },
  lng: {
    type: Sequelize.FLOAT
  },
  seating: {
    type: Sequelize.INTEGER
  }
});

Bench.sync({ force: true}).then(() => {
  Bench.create({
    description: 'A really great bench',
    lat: 37.7833,
    lng: -122.4167,
    seating: 4
  });
  Bench.create({
    description: 'A decent bench',
    lat: 37.777,
    lng: -122.4234,
    seating: 3
  });
  Bench.create({
    description: 'Nice bench',
    lat: 37.747,
    lng: -122.4834,
    seating: 8
  });
  Bench.create({
    description: 'Cool bench',
    lat: 37.797,
    lng: -122.4934,
    seating: 1
  });

});

module.exports = {
  Bench,
};

