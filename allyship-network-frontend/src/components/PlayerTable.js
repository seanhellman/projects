import React from "react";
import { Table, Image } from "react-bootstrap";
import { MOCK_TEAM_1 } from "../mock_data/mockTeamData";
import { AVATARS, GENDERS } from "../constants";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const displayName = "Mock Participant 1"
  const gender = 0
  const age = 21
  const timeZone = "PST"
  const avatarId = 1
  const totalClicks = 2
  return { displayName, gender, age, timeZone, avatarId, totalClicks };
};

const style = { fontWeight: "bold" };

const PlayerTable = (props) => {
  return (
    <Table striped bordered size="sm">
      <thead>
        <tr>
          <th></th>
          <th>{props.displayName}</th>
          {MOCK_TEAM_1.map((player, i) => (
            <th key={`player${i + 1}-display-name`}>{player.displayName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>
            <Image src={`/img/avatars/${AVATARS[props.avatarId]}`} fluid />
          </td>
          {MOCK_TEAM_1.map((player, i) => (
            <td key={`player${i + 1}-avatar`}>
              <Image
                src={`/img/avatars/${AVATARS[player.avatarId]}`}
                fluid
              />
            </td>
          ))}
        </tr>
        <tr>
          <td style={style}>Gender:</td>
          <td>{GENDERS[props.gender]}</td>
          {MOCK_TEAM_1.map((player, i) => (
            <td key={`player${i + 1}-gender`}>{GENDERS[player.gender]}</td>
          ))}
        </tr>
        <tr>
          <td style={style}>Age:</td>
          <td>{props.age}</td>
          {MOCK_TEAM_1.map((player, i) => (
            <td key={`player${i + 1}-age`}>{player.age}</td>
          ))}
        </tr>
        <tr>
          <td style={style}>Time zone:</td>
          <td>{props.timeZone}</td>
          {MOCK_TEAM_1.map((player, i) => (
            <td key={`player${i + 1}-time-zone`}>{player.timeZone.toUpperCase()}</td>
          ))}
        </tr>
        <tr>
          <td style={style}>Times volunteered:</td>
          <td>{props.totalClicks}</td>
          {MOCK_TEAM_1.map((player, i) => (
            <td key={`player${i + 1}-times-volunteered`}>
              {player.totalClicks}
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default connect(mapStateToProps)(PlayerTable);
