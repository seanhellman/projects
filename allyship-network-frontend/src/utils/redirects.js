import { DOMAIN } from "../constants";

export const handleConsentRedirect = (request) => {
  const params = new URLSearchParams(request.location.search);
  const consent = params.get("Consent");
  if (consent === 0) {
    window.top.location.href = `${DOMAIN}/participant-dashboard`;
  } else {
    window.top.location.href = `${DOMAIN}/participant-dashboard/pre-survey`;
  }
  return null;
};

export const handlePreSurveyRedirect = (request) => {
  const params = new URLSearchParams(request.location.search);
  const participantId = params.get("PID");
  const name = params.get("name");
  const age = params.get("age");
  const gender = params.get("gender");
  const timezone = params.get("timezone");
  const avatar = params.get("avatar");
  const result = parseInt(params.get("result"));
  if (result === 1) {
    console.log("result was 1");
    window.top.location.href = `${DOMAIN}/participant-dashboard/select-a-time-slot?participantId=${participantId}&name=${name}&age=${age}&gender=${gender}&timezone=${timezone}&avatar=${avatar}#update`;
  }
  return null;
};

export const handlePostSurveyRedirect = () => {
  window.top.location.href = `${DOMAIN}/participant-dashboard#updatePostSurvey`;
  return null;
};
