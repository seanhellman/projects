export const PRE_WINDOW_MINUTES = 10;
export const POST_WINDOW_MINUTES = 120;
export const MILLISECONDS_PER_SECOND = 60000;
export const PRE_WINDOW = PRE_WINDOW_MINUTES * MILLISECONDS_PER_SECOND;
export const POST_WINDOW = POST_WINDOW_MINUTES * MILLISECONDS_PER_SECOND;

export const TASKS = [
  { var: "completeConsentForm", text: "complete consent form", path: "consent-form" },
  { var: "completePreSurvey", text: "complete pre-survey", path: "pre-survey" },
  { var: "timeSlot", text: "select a time slot", path: "select-a-time-slot" },
  { var: "completeExperiment", text: "join experiment", path: "/" },
  { var: "completePostSurvey", text: "complete post-survey", path: "post-survey" },
];

export const ONBOARDING_CONTENT = [
  {heading: "slide 1", paragraph: "text content for slide 1"},
  {heading: "slide 2", paragraph: "text content for slide 2"},
  {heading: "slide 3", paragraph: "text content for slide 3"},
];

export const USER_ROLE_TYPES = {
  participant: "participant",
  monitor: "monitor",
  admin: "admin",
};

export const GENDERS = ["Man", "Woman"];

export const AVATARS = [
  "no avatar",
  "NAV1.png",
  "NAV2.png",
  "NAV3.png",
  "NAV4.png",
  "NAV5.png",
  "NAV6.png",
  "NAV7.png",
  "NAV8.png",
  "NAV9.png",
  "NAV10.png",
  "NAV11.png",
  "NAV12.png",
];

// time slot constants

export const NOT_SIGNED_UP_TEXT = "You have not yet selected a time slot.";
export const TIME_SLOT_JOIN_TEXT = `You will be able to click to join the experiment ${PRE_WINDOW_MINUTES} minutes prior to the start of your time slot.`
export const SIGNED_UP = "signed up";
export const AT_CAPACITY = "at capacity";

export const RULES_TEXT = "You have been randomly matched with 3-7 other participants. You have 90 seconds to decide whether or not you want to volunteer. If no member of your group volunteers you will earn $0.05 for this round. If a member of your group volunteers then that person will make $0.06 and the other members of the group will each make $0.10."

// qualtrics survey URLs
export const QUALTRICS_CONSENT_SURVEY = "https://ubc.ca1.qualtrics.com/jfe/form/SV_6sCHVnjj9MUPLeJ";
export const QUALTRICS_PRE_SURVEY = "https://ubc.ca1.qualtrics.com/jfe/form/SV_2rxEJYzFg36IAGp";
export const QUALTRICS_POST_SURVEY = "https://ubc.ca1.qualtrics.com/jfe/form/SV_8jKxiWxkkwBi4h7";

export const DOMAIN = "http://localhost:3000"

export const TWILIO_SERVER = "http://localhost:3001"

// backend constants
export const FETCH_URL = "http://35.203.23.78/";
export const GRANT_TYPE = "password";
export const CLIENT_ID = "9lh1BosWCvu5G7n8hua5l5hRn9NFUu8z2w2FT2n4";
export const CLIENT_SECRET = "sK7TSLkNw2RjLvP5gRazGSOFmkEJh13FiX8MFoXlSHXZ45yq4iFkBRMa6SmLOJGFW9t06ZShfpYSc6cwDVvQ4wQWoEi2EbQWhGyFJp6XvgODtFwwEgQVnQtN7SXSeYUD";
export const TOKEN_REMOVE_DEPLOY = "noLJqdkLG6GUnX6UOYnxC0or2nzrsZ";