var activeRoom

const Video = Twilio.Video;

token="";

console.info(window.event)

message_box = document.getElementById('message_box')

const createLocalTracks = Video.createLocalTracks;

const connect = Video.connect;

global_objects = {}


document.getElementById('connect_to_room').onclick = function () {

  var data_to_send = {
  user_name: document.getElementById('user_name').value,
  room_name: document.getElementById('room_name').value
  }

console.info(data_to_send)
  var connect_room = new XMLHttpRequest();
  connect_room.open("POST", "/", true);
  connect_room.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      token = connect_room.response;
      console.info(token)
      global_objects['token'] = token;
      createLocalTracks({
        audio: true,
        video: { width: 640 }
      }).then(localTracks => {
        return connect(token, {
          name: 'my-room-name',
          tracks: localTracks
        });
      }).then(room => {
        activeRoom = room;
        console.log(`Connected to Room: ${activeRoom.name}`);
        print_to_message_box(`Connected to Room: ${room.name}`);
        activeRoom.participants.forEach(participant => {
          console.log(`Participant "${participant.identity}" is connected to the Room`);
          print_to_message_box(`Participant "${participant.identity}" is connected to the Room`);
          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              const track = publication.track;
              document.getElementById('remote_media').appendChild(track.attach());
            }            
          });
      


        });

        room.on('participantConnected', participant => {
            console.log(`A remote Participant connected: ${participant.identity}`);
            print_to_message_box(`A remote Participant connected: ${participant.identity}`);

            participant.on('trackSubscribed', track => {
              document.getElementById('remote_media').appendChild(track.attach());
            });
        });

        }, error => {
            console.error(`Unable to connect to Room: ${error.message}`);
            print_to_message_box(`Unable to connect to Room: ${error.message}`)
        });
  };
  };
  connect_room.send(JSON.stringify(data_to_send));

    };



Video.createLocalVideoTrack().then(track => {
    const localMediaContainer = document.getElementById('local_media');
    localMediaContainer.appendChild(track.attach()),
    document.getElementById('local_media').childNodes[1].style.width = '320px';
    document.getElementById('local_media').childNodes[1].style.height = '240px';
  },function(error) {
    console.error('Unable to access local media', error);
    print_to_message_box('Unable to access local media', error);
}) ;

// ---------------

function print_to_message_box(message) {

  message_box.children[0].innerText += "\r\n"+message
  message_box.scrollTop = message_box.scrollHeight;


}
  
