import React from 'react';
import { QUALTRICS_POST_SURVEY } from '../constants';
import { connect } from 'react-redux';

const style = { minHeight: "700px" };

const mapStateToProps = state => {
  const { participantId } = state.participant;
  return { participantId };
}

const PostSurvey = (props) => {
  return (
    <div className="iframe-container" style={style}>
    <iframe
      title="pre-survey"
      src={QUALTRICS_POST_SURVEY + `?PID=${props.participantId}`}
    ></iframe>
  </div>
  );
}
 
export default connect(mapStateToProps)(PostSurvey);