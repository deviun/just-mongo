# Listen collection

This method is in an experimental state, use it with extreme caution!

## Listening stages

- Set the check function for new data.
- Configure Listener.
- Configure error recovery.
- Done!

---

#### 1) Set the check function for new data

```javascript
// initialize the collection
const feedDB = mongo.collection('feed');

const subs = feedDB.listen(async (lastUpdates) => {
  // your code
});
```

The function can receive the previous updates, but initially they do not exist, do not forget about it. The function must return any type of data with an update. If the data is positive, it will be returned to the listener, otherwise it skips the step.

**Positive data definition table:**

| type | will return if... |
| --- | --- |
| String | value.length !== 0 |
| Number | value !== 0 |
| Array | value.length !== 0 |
| Object | Object.keys(value).length !== 0 |
| Boolean | value === true |
| *otherType* | *always return* |

#### 2) Configure Listener

```javascript
function yourListener (updates) {
  // your code
}

subs.addListener(yourListener);

// to delete the listener
subs.removeListener(yourListener);
```

#### 3) Configure error recovery

At any time, you may experience an error. To get it, create a listener for errors.

```javascript
subs.error((err) => {
  console.log.(err);
});
```

#### DONE!

Now when the new data appears, you will get them.
Listening can be stopped:

```javascript
subs.close();
```

After that, checking and getting new updates will be stopped.

----

Also see an [example](https://github.com/deviun/just-mongo/blob/master/examples/listen.test.js) of using listening.