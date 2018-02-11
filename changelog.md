# Change log 

## v1.7
- **1.7.4**
  - Minor Fixed bugs.
- **1.7.3**
  - Fixed bugs.
- **1.7.2**
  - Fixed major bugs for update with `$inc`.
  - Fixed test for `collection.listen`.
- **1.7.1**
  - Parsing `_id` for `find`, `findOne`, `deleteOne`, `deleteMany`, `updateOne`, `updateMany` as **ObjectID**.
  - Been added method `collection.ObjectID` for getting ObjectID from string/number.
  - And minor fixes.
- **1.7.0**
  - Managing the structure of documents when fetching from a database. [Read about it](https://github.com/deviun/just-mongo/blob/master/docs/document-project.md).
  - Listening to collections. [Read about it](https://github.com/deviun/just-mongo/blob/master/docs/listen-collection.md).
  - Other minor fixes.

## v1.6
- **1.6.9**
  - The smiley has been fixed in the documentation. Without this update in any way.
  - We also corrected the error, but then all of a sudden it worked and we decided that the smiley is enough in this version.
- **1.6.8**
  - Changes for native connection. Read [this](https://github.com/deviun/just-mongo/blob/master/docs/native-connection.md) doc.
  - Minor fixes.
- **1.6.7**
  - Minor fixes.
- **1.6.6**
  - Fixed work with `Array` type.
  - Documented data type.
- **1.6.5**
  - Now when initializing collections, JS memory has is only one copy for one connection.
- **1.6.4**
  - Been added speed tests.
- **1.6.3**
  - Minor changes.
- **1.6.2**
  - Creating multi connections.
- **1.6.1**
  - Tests of a healthy person.
  - Bug fixes.
    - Creating native connection.
    - Validation of model without models.
- **1.6.0**
  - Created new engine for joining collections.

## v1.5

- **1.5.0**
  - Method added `collection.findRandom`.


## recent updates [< v1.5.0]
- Fixed bugs in the validator when working with update operators.
- Work with the native API has been improved.
- Been added strict mode for validation.
- Been added manage log level in package.