/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Watched transaction processor function.
 * @param {org.acme.sample.WatchedTransaction} tx The watched transaction instance.
 * @transaction
 */
function watchVideoClip(tx) {
  	tx.newsClip.producer.points = tx.newsClip.producer.points + 10;
    tx.consumer.reputation = tx.consumer.reputation + 100;
  
  	if(tx.newsClip.published == false){
      // Emit an event for the modified asset.
      var event = getFactory().newEvent('org.acme.sample', 'ErrorEvent');
      event.eventName = tx.newsClip.clipId+" cannot be viewed, it is not published yet."
      emit(event);
      return null
    }else{
      // Get the asset registry for the asset.
      return getAssetRegistry('org.acme.sample.NewsClip')
          .then(function (assetRegistry) {

              // Update the asset in the asset registry.
              return assetRegistry.update(tx.newsClip);

          })
          .then(function () {
              return getParticipantRegistry('org.acme.sample.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.newsClip.producer);
          })
          .then(function () {
              return getParticipantRegistry('org.acme.sample.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.consumer);
          })
          .then(function () {

              // Emit an event for the modified asset.
              var event = getFactory().newEvent('org.acme.sample', 'WatchedEvent');
              event.eventName = tx.consumer.firstName+" watched clip: "+tx.newsClip.clipId
              event.newsClip = tx.newsClip;
              event.producer = tx.newsClip.producer;
              event.consumer = tx.consumer;
              emit(event);
          });
    }
}

/**
 * Published transaction processor function.
 * @param {org.acme.sample.PublishedTransaction} tx The published transaction instance.
 * @transaction
 */
function publishVideoClip(tx) {
  	tx.newsClip.producer.reputation = tx.newsClip.producer.reputation + 100;
    tx.newsClip.published = true;
  
  	if(tx.newsClip.producer.userId != tx.producer.userId){
      // Emit an event for the modified asset.
      var event = getFactory().newEvent('org.acme.sample', 'ErrorEvent');
      event.eventName = tx.newsClip.clipId+" can only be published by the producer: "+tx.producer.userId
      emit(event);
      return null
    }else{
      // Get the asset registry for the asset.
      return getAssetRegistry('org.acme.sample.NewsClip')
          .then(function (assetRegistry) {

              // Update the asset in the asset registry.
              return assetRegistry.update(tx.newsClip);

          })
          .then(function () {
              return getParticipantRegistry('org.acme.sample.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.newsClip.producer);
          })
          .then(function () {

              // Emit an event for the modified asset.
              var event = getFactory().newEvent('org.acme.sample', 'PublishedEvent');
              event.eventName = tx.producer.firstName+" published clip: "+tx.newsClip.clipId
              event.newsClip = tx.newsClip;
              event.producer = tx.newsClip.producer;
              emit(event);
          });
    }
}