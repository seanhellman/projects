import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { QUALTRICS_PRE_SURVEY } from '../constants';
import { putParticipantAttributes } from '../utils/post';
import { setParticipantInfo } from '../redux/actions';

const style = { minHeight: "700px" };

const mapStateToProps = state => {
  const { participantId } = state.participant;
  return { participantId };
}

const PreSurvey = (props) => {

  useEffect(() => {
    putParticipantAttributes(props.participantId, {
      complete_consent_form: true,
    }).then((data) => {
      props.setParticipantInfo(data);
    })
  });

  return (
    <div className="iframe-container" style={style}>
    <iframe
      title="pre-survey"
      src={QUALTRICS_PRE_SURVEY + `?PID=${props.participantId}`}
    ></iframe>
  </div>
  );
}
 
export default connect(mapStateToProps, { setParticipantInfo })(PreSurvey);