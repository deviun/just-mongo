const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  staff: {
    name: String,
    id: Number,
    ban: Boolean
  },
  journal: {
    staff_id: Number,
    index: Number
  }
};

//  Данные
const data = {
  staff: [
    {id: 1, name: 'Anton'},
    {id: 2, name: 'Sam'},
    {id: 3, name: 'Max'}
  ],
  journal: [
    {staff_id: 1}, // add index property
    {staff_id: 2},
    {staff_id: 3}
  ]
};

const $mongo = new $JMongo({
  models,
  log: 'debug',
  db: 'jmongo'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.info({ok});
  }
});

const staffDB = $mongo.collection('staff');
const journalDB = $mongo.collection('journal');

async function clearDatabase () {
  await staffDB.deleteMany();
  await journalDB.deleteMany();
}

async function insertData () {
  await staffDB.insert(data.staff);

  const journal = ([...data.journal]).map((item, index) => {
    item.index = index;

    return item;
  });

  await journalDB.insert(journal);

  const [itemsStaff, itemsJournal] = await $Promise.all([
    staffDB.find(false, {
      project: {
        _id: 0
      }
    }),
    journalDB.find(false, {
      project: {
        _id: 0
      }
    })
  ]);

  $log.info({
    itemsStaff,
    itemsJournal
  });
}

async function join () {
  const resultJoin = await journalDB.join(false, staffDB, {staff_id: 'id'}, {
    id: '0.staff_id',
    name: '1.name',
    journal_index: '0.index'
  }, {
    joinDocument: true,
    skip: 0,
    limit: 100
  });

  $log.info(resultJoin);
}

const fnPipeline = [
  clearDatabase,
  insertData,
  join
];

(async () => {
  for (const fn of fnPipeline) {
    await fn().catch((err) => {
      $log.error(err);
    });
  }

  process.exit();
})();
