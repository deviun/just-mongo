# Change log 

## v2.2
- **2.2.2**
    - Update lodash version
- **2.2.1**
    - Fix TypeScript declaration
- **2.2.0**
    - Declared types (for Typescript)
    - Minor refactoring
    - Export default JMongo (use `import JMongo from` or `require(...).default`)
## v2.1
- **2.1.8**
  - Fixed get default values from jprovider if default values dont inited
- **2.1.7**
  - Hotfix for collection ready without models
- **2.1.6**
  - Create connection without models
  - Move to MIT License
- **2.1.5**
  - Change detect ObjectID in queries
- **2.1.4**
  - Fix replace _id to object id in $in
- **2.1.3**
  - Optimize code.
  - Force use safe mode in join engine. For more read docs about the Join engine.
- **2.1.2**
  - NEW lodash version.
- **2.1.1**
  - Fixed insert 0 docs.
  - Fixed config for ava tests.
- **2.1.0**
  - Added support for default values for schemas. Not supported in inaccurate schemes.
## v2.0
- **2.0.0**
  - Document validation is now performed on the server side of the database. Now you can configure more flexible document schemes.
  - Due to the first point, very evil bugs disappeared.
  - Have a nice work!
## v1.7
- **1.7.9**
  - Fixed bugs for find with $or.
- **1.7.8**
  - Fixed bugs. Also, a fully updated data validation is expected soon based on the model.
- **1.7.4**
  - Fixed bugs.
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
