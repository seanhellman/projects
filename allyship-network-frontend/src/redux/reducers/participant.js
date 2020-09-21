import {
  TOGGLE_WAITING_ROOM_STATUS,
  SET_CHAT_CLIENT,
  SET_ACTIVE_CHANNEL,
  SET_TIME_SLOT,
  SET_PARTICIPANT_INFO,
} from "../actionTypes";

const initialState = {
  age: 0,
  avatarId: 0,
  basePayment: 0,
  completeConsentForm: false,
  completeExperiment: false,
  completeOnboarding: false,
  completePostSurvey: false,
  completePreSurvey: false,
  displayName: "",
  gender: "",
  isStillActive: false,
  killStatus: 0,
  participantId: 0,
  preSurveyBonus: 0,
  seedStatus: 0,
  timeSlot: null,
  timeZone: "",
  totalClicks: 0,
  totalRegularBonus: 0,
  totalSeedBonus: 0,
  userId: null,
  // local only
  chatClient: null,
  activeChannel: null,
  waitingRoomStatus: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PARTICIPANT_INFO:
      return {
        ...state,
        age: action.payload.age,
        avatarId: action.payload.avatar_id,
        basePayment: parseFloat(action.payload.base_payment),
        completeConsentForm: action.payload.complete_consent_form,
        completeExperiment: action.payload.complete_experiment,
        completeOnboarding: action.payload.complete_onboarding,
        completePostSurvey: action.payload.complete_post_survey,
        completePreSurvey: action.payload.complete_pre_survey,
        displayName: action.payload.display_name,
        gender: action.payload.gender,
        isStillActive: action.payload.is_still_active,
        killStatus: action.payload.kill_status,
        participantId: action.payload.id,
        preSurveyBonus: parseFloat(action.payload.pre_survey_bonus),
        seedStatus: action.payload.seed_status,
        timeSlot: action.payload.timeslot,
        timeZone: action.payload.region_id,
        totalClicks: action.payload.total_clicks,
        totalRegularBonus: parseFloat(action.payload.total_regular_bonus),
        totalSeedBonus: parseFloat(action.payload.total_seed_bonus),
        userId: action.payload.user,
      }
    case TOGGLE_WAITING_ROOM_STATUS:
      return {
        ...state,
        waitingRoomStatus: !state.waitingRoomStatus,
      };
    case SET_CHAT_CLIENT:
      return {
        ...state,
        chatClient: action.payload,
      };
    case SET_ACTIVE_CHANNEL:
      return {
        ...state,
        activeChannel: action.payload,
      };
    case SET_TIME_SLOT:
      return {
        ...state,
        timeSlot: action.payload,
      };
    default:
      return state;
  }
};