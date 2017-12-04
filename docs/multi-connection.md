# Multi connection

Just Mongo allows you to easily connect to multiple databases and have access to them anywhere in the code.

#### Create

```javascript
const $JMongo = require('just-mongo');

const connectionToYourDB = new $JMongo(...);
const connectionToOtherDB = new $JMongo(...);

const mongo = $JMongo.muti({
  your: connectionToYourDB,
  other: connectionToOtherDB
});
```

You can forget about our API and write so...

```javascript
const mongo = {
  your: connectionToYourDB,
  other: connectionToOtherDB
};
```

You can write like that, but you need to take into account that we plan to expand the capabilities of multi-connections, so it is advisable to use `just-mongo` in advance.

#### Use

```javascript
const yourCollection = mongo.db.your.collection(...);
...

const otherCollection = mongo.db.other.collection(...);
```