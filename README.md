# News Clip Business Network

> This is a news clip Hyperledger Composer sample, which demonstrates the core functionality of Hyperledger Composer by changing the values of the points for producer of clips after a watched transaction and well as changing the value of reputation for consumer that are watching the produced video news clips.

This business network defines:

**Participant**
`User`

**Asset**
`NewsClip`

**Transaction**
`WatchedTransaction`
`PublishedTransaction`

**Event**
`WatchedEvent`
`ErrorEvent`

NewsClip are produced by a Users (producers) and watched by Users (consumers) and the value property on a NewsClip can be modified by submitting either a PublishedTransaction or WatchedTransaction. The PublishedTransaction must be submitted by the producer prior to submitting a WatchedTransaction by any User in the network which will subsequently emits a WatchedEvent.

To test this Business Network Definition in the **Test** tab:

Create a `User` participant:

```
{
  "$class": "org.acme.sample.User",
  "userId": "USER1",
  "firstName": "Tobias",
  "lastName": "Hunter",
  "points":"0",
  "reputation":"0",
}
```

Create a `NewsClip` asset:

```
{
  "$class": "org.acme.sample.NewsClip",
  "clipId": "CLIP1",
  "producer": "resource:org.acme.sample.User#USER1",
  "title": "POTUS",
  "topic": "politics",
  "tags": "potus, politics",
  "length": "120"
}
```

Submit a `PublishedTransaction` transaction:

```
{
  "$class": "org.acme.sample.WatchedTransaction",
  "newsClip": "resource:org.acme.sample.NewsClip#CLIP1",
  "producer": "resource:org.acme.sample.User#USER1"
}
```

Submit a `WatchedTransaction` transaction:

```
{
  "$class": "org.acme.sample.WatchedTransaction",
  "newsClip": "resource:org.acme.sample.NewsClip#CLIP1",
  "consumer": "resource:org.acme.sample.User#USER1"
}
```

After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `WatchedEvent` has been emitted.
