# Join Engine

The Join Engine will allow you to connect the sample with another collection by linking to a specific field, also allows you to describe the documents at the output.

The engine has two implementations that are used as needed. Carefully study the extremes of the work of these implementations.

### Example

```javascript
const collection1 = $mongo.collection('collection1');
const collection2 = $mongo.collection('collection2');

const results = await collection1.join(false, collection2, {propCol1: 'propCol2'}, {
  newProp: '0.propCol1',
  newProp2: '1.propCol2',
  _id: '0._id'
}, {
  limit: 5
});
```

Description of parameters:

| Parameter | Type | Requried | Default | Description |
|:----------|:----:| :-------:| :------:| :------|
| filter | object | no | false | Filter sample for the first collection
| joinCollection | object | yes | - | Collection from which will be merged |
| collectionLink | object | yes | - | Describes the relationship between two collections |
| newDocumentView | object | yes | - | Describes a new kind of document using links to fields in two collections. <br> `newProperty: '[0-1].{property}',` <br> **0** - main collection. <br> **1** - joined collection. |
| options | object | no | false | Sampling settings from the main collection: <br> **limit**, **skip**, **sort** <br> And the settings for sampling from the second collection: <br> ***joinDocument***  |

The example above uses only one query to the database, it's fast and efficient, but only if one connection record is expected.

If there can be more than one entry for the connection, you must explicitly specify which document to attach to the main collection. To do this, use the joinDocument parameter, which describes the additional conditions for retrieving the document from the second collection.

```javascript
const collection1 = $mongo.collection('collection1');
const collection2 = $mongo.collection('collection2');

const results = await collection1.join(false, collection2, {propCol1: 'propCol2'}, {
  newProp: '0.propCol1',
  newProp2: '1.propCol2',
  _id: '0._id'
}, {
  limit: 5,
  joinDocument: {
    filter: {
      prop: {$ne: true}
    },
    sort: {
      score: -1
    }
  }
});
```

This query uses two database queries and more Node.js resources. This is not so significant if you select a relatively small number of documents.The properties `filter` and `sort` are optional.

[An example of using join](https://github.com/deviun/just-mongo/blob/master/test/join.test.js)