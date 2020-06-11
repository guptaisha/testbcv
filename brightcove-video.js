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
  window.parent.postMessage(eventDetail,"https://www.ion.fiserv.com");
}

/**
 * Send milestone events.
 */

var fcurrentTime = player.currentTime();
var fduration = player.duration();
var percentNum = Math.floor((fcurrentTime/fduration)*100);
console.log(fcurrentTime,' / ', fduration, ' - ',percentNum);

if (percNum>0 && percNum <25)
    {
      percNumGroup = 1
    }
    else if (percNum>=25 && percNum <50)
    {
      percNumGroup = 25
    }
    else if (percNum>=50 && percNum <75)
    {
      percNumGroup = 50
    }
    else if (percNum>75 && percNum <=95)
    {
      percNumGroup = 75
    }
    else if (percNum>95 && percNum <=100)
    {
      percNumGroup = 99
    }
    return (percNumGroup);
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
          'pause',
          'play',
		  percNumGroup
        ];
        playerEvents.forEach(function(playerEvent) {
          player.on(playerEvent, handlePlaybackEvent_);
        });
      });
    } catch (e) {
      console.warn(e);
    }
  }
 
}
console.log("**Start window.parent pm- brightcove test**")
handleBrightcovePlayers(1);
