import React from 'react';
import { Row, Col } from 'reactstrap';

const Footer = (props) => {

    let compScore = props.playMode === 'Computer' ? 
    <p className="info-icon bright-red">{'Computer Score: ' + props.compScore + ' / ' + props.numQuestions}</p>
    :
    ''

    return (
        <Row className="mt-3">
            <Col>
                <p className="info-icon bright-red">{'Score: ' + props.userScore + ' / ' + props.numQuestions}</p>
                {compScore}
            </Col>
        </Row>
    )
}


export default Footer;