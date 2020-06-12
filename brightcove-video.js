/**
 * @fileoverview Detects video playback events in the Brightcove player and
 * sends a CustomEvent for each of them.
 *
 * Although the player is loaded in an IFRAME, Brightcover overwrites
 * `postMessage` with their own function, so you can't post messages between
 * the parent and frame windows.
 *
 * But the script is run in the context of the parent window. So CustomEvents
 * can be dispatched and they can be received in the main window.
 *
 * @author yuhui
 * @version 1.1.0
 *
 * @doc Brightcove Player development overview https://player.support.brightcove.com/coding-topics/overview-player-api.html
 * @doc Brightcove Player API https://docs.brightcove.com/brightcove-player/current-release/Player.html
 * @doc HTML5 media events https://html.spec.whatwg.org/#mediaevents
 */

/**
 * @private
 * Given a playback event, get other metadata related to the event,
 * then send the event's details to the parent.
 * @param {Event} event The playback event.
 * @this The Brightcove player object.
 */
function handlePlaybackEvent_(event) {
  var state = event.type;
  var player = this;

  var eventDetail = {
    currentTime: player.currentTime(),
    duration: player.duration(),
    name: player.mediainfo.name,
    state: state,
  };
  var eventInit = {
    detail: eventDetail,
  };
console.log("Player Start")
  var customEvent = new CustomEvent(state, eventInit);
  //console.log(eventDetail)
  //window.parent.dispatchEvent(customEvent);
  window.parent.postMessage(eventDetail,"*");
}

/**
 * @public
 * Send CustomEvents to the parent for specific media playback events.
 * @param {int} numTries Counter of tries to check that players are valid.
 */
function handleBrightcovePlayers(numTries) {
  var players = videojs.getPlayers();
  var playerIds = Object.keys(players);
  if (playerIds.length === 0) {
    // players are not ready, try again
    // give up after about 7.5 seconds
    if (numTries < 10) {
      // use exponential backoff to delay
      setTimeout(function() {
        var numTries = numTries * 2;
        handleBrightcovePlayers(numTries);
      }, numTries * 500);
    }
  } else {
    var playerId = playerIds[0];
    try {
      videojs.getPlayer(playerId).ready(function() {
        var player = this;
        var playerEvents = [
          'ended',
          'play',
		  'timeupdate',
        ];
        playerEvents.forEach(function(playerEvent) {
		var fcurrentTime = player.currentTime();
		var fduration = player.duration();
		var fpercentViewed = Math.floor((fcurrentTime/fduration)*100);
		var ev = player._isEventViewed;
		if (playerEvent =='play' && !player._isEventViewed.play)
		{
          player.on(playerEvent, handlePlaybackEvent_);
		  player._isEventViewed.play=true;
		}
		if (playerEvent =='ended' && !player._isEventViewed.ended)
		{
          player.on(playerEvent, handlePlaybackEvent_);
		  player._isEventViewed.ended=true;
		}
		if (playerEvent =='timeupdate')
		{
			if (!ev['25'] && fpercentViewed >= 25)
			{
			  player.on(playerEvent, handlePlaybackEvent_);
			  ev['25']=true;
				console.log("***25****");
			}
			else if (!ev['50'] && fpercentViewed >= 50)
			{
			  player.on(playerEvent, handlePlaybackEvent_);
			  ev['50']=true;
				console.log("***50****");
			}
			else if (!ev['75'] && fpercentViewed >= 75)
			{
			  player.on(playerEvent, handlePlaybackEvent_);
			  ev['75']=true;
				console.log("***75****");
			}
		}
        });
      });
    } catch (e) {
      console.warn(e);
    }
  }
}
console.log("**Start window.parent pm- timeupdate**")
handleBrightcovePlayers(1);
