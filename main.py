from google.appengine.ext import ndb
from google.appengine.ext.webapp import template
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

import webapp2
import json
import os
from account import config_params


# Required for all Twilio Access Tokens
account_sid = config_params.get('account_sid')
api_key = config_params.get('api_key')
api_secret = config_params.get('api_secret')

class MainPageHandler(webapp2.RequestHandler):
    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, {}))

    def post(self):
        input_data = json.loads(self.request.body)
        identity = input_data.get('user_name')
        room = input_data.get('room_name')
        print identity
        print room

        token = AccessToken(account_sid, api_key, api_secret, identity=identity)
        # Create a Video grant and add to token

        video_grant = VideoGrant(room)
        token.add_grant(video_grant)
        print token.to_jwt()
        # Return token info as JSON
        return self.response.out.write(token.to_jwt())


class GenToken(webapp2.RequestHandler):
    def get(self):
        # Create Access Token with credentials
        token = AccessToken(account_sid, api_key, api_secret, identity=identity)

        # Create a Video grant and add to token
        video_grant = VideoGrant(room='cool room')
        token.add_grant(video_grant)

        # Return token info as JSON
        print token.to_jwt()


application = webapp2.WSGIApplication([
    webapp2.Route('/', MainPageHandler),
    webapp2.Route('/token', GenToken),

], debug=True)


