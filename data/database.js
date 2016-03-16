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
  return Bench.create({
    description: 'A really great bench',
    lat: 37.7833,
    lng: -122.4167,
    seating: 4
  });
});

module.exports = {
  Bench,
};

