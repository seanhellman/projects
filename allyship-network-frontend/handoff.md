# Frontend Handoff Document

## Overview
- The flow is generally working (in good cases, i.e., participant consents,
submits pre-survey, etc.)! There are some edge cases and alternate scenarios that
need to be considered (i.e., what happens if a person does not consent?). I go
on to talk about a few of those specifically below.

## Onboarding
- Onboarding/modal content needs to be created

## Consent Form
- There's an embedded data check in the Qualtrics survey. I presume Tara was using 
it to debug something. It should probably be removed :-)
- Should a participant be able to resubmit if they made a mistake? The platform
does not currently account for this.

## PreSurvey
- Should a participant be able to resubmit if they made a mistake? The platform
does not currently account for this.
- Some of the female avatar images are not working (inside the Qualtrics survey). I
opened an issue on GitHub for this.

## TimeSlotSelect
- The percent indicators may need to be tweaked. They're a bit hard to see if the 
time slot isn't very full yet.
- It would probably make sense to filter out time slots that have already occurred
from the list of possible choices (currently does not do that).
- API call to update time slot is not working (I opened an issue in GitHub)

## Participant Dashboard
- Participant is not currently able to redo the consent form if they accidentally
click "I do not agree" or change their mind. We may want to add a field to the participant,
like ```consented``` with a value of ```true|false```.
- How to incorporate seed bonus on the dashboard? Before the experiment is over, we
obviously don't want to call that out? It can either be hidden in the "Participant bonus"
line or appear after the experiment is over as a separate line item.

## Post Survey
- We can pass the total earned to the Qualtrics survey. I believe at one point Tara
requested that. It doesn't look like she set the survey up to do anything with that
information, though. So might be worthwhile to double check with her.
- What should happen after the post survey is completed? Right now I'm just making
a call to update the backend and then redirecting to the dashboard. Might make sense
to show a message instead or provide instructions on how user will receive payment.

## Chat
- Twilio server is in the allyship-network-chat-server repo. The server assigns a
token and initiates a chat client.
- Client code is in ChatTest.js and several relevant functions in actions.js, including:
fetchAccessToken, connectMessagingClient, initClient, getChannel, joinChannel,
and leaveChannel. This should be pretty good to go, though may need some additional
debugging. 
- Here's the [Twilio Chat Doc](http://media.twiliocdn.com/sdk/js/chat/releases/4.0.0/docs/index.html).
Note the ```sendMessage``` method is part of the Channel class.
- I have not created components (as in, HTML + CSS) for individual messages.

## GameButton
- Note the FIXME comment on line 13 (API call needs to be updated with actual team id)