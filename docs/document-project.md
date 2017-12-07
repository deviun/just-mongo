# Document project

If you have a dynamic document structure, you can manage it through `mongo.setDocumentProject` after creating the connection.

```javascript
const mongo = new JustMongo(...);

mongo.setDocumentProject('users', function () {
  return {
    first_name: this.name,
    age: this.age,
    adult: this.age >= 18
  };
});

const usersDB = mongo.collection('users');
```

The replacement function works in the context of a particular document.

#### Methods that support this logic:

- find
- findOne

----

You can see an [example](https://github.com/deviun/just-mongo/blob/master/examples/set-project-document.js).