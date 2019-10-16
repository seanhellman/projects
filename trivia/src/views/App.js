import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from '../components/Header';
import Main from '../components/Main';
import UserSettings from '../components/UserSettings';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsConfigured: false,
      allCategories: [],
      numQuestions: 10,
      difficultyLevel: 'Any',
      category: 'All',
      playMode: 'Solo',
    }

    this.setNumQuestions = this.setNumQuestions.bind(this);
    this.setDifficultyLevel = this.setDifficultyLevel.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setPlayMode = this.setPlayMode.bind(this);
    this.markSettingsConfigured = this.markSettingsConfigured.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(myJson => {
        let categories = myJson.trivia_categories.map(catObj => catObj.name);
        this.setState({ allCategories: categories })
      });
  }

  setNumQuestions(event) {
    this.setState({
      numQuestions: event.target.value
    });
  }

  setDifficultyLevel(event) {
    this.setState({
      difficultyLevel: event.target.value
    });
  }

  setCategory(event) {
    this.setState({
      category: event.target.value
    });
  }

  setPlayMode(event) {
    this.setState({
      playMode: event.target.value
    });
  }

  markSettingsConfigured() {
    this.setState({
      settingsConfigured: true
    });
  }

  restart() {
    this.setState({
      settingsConfigured: false,
      numQuestions: 10,
      difficultyLevel: 'Any',
      category: 'All',
      playMode: 'Solo',
    });
  }

  render() {

    let difficultyLevel = this.state.difficultyLevel === 'Any' ? ''
      : this.state.difficultyLevel.toLowerCase();

    let category = this.state.category === 'All' ? ''
      : this.state.allCategories.indexOf(this.state.category) + 9;

    let display = this.state.settingsConfigured ?
      <Main
        numQuestions={this.state.numQuestions}
        difficultyLevel={difficultyLevel}
        category={category}
        playMode={this.state.playMode}
        restart={this.restart}
      />
      :
      <UserSettings
        allCategories={this.state.allCategories}
        numQuestions={this.state.numQuestions}
        setNumQuestions={this.setNumQuestions}
        setDifficultyLevel={this.setDifficultyLevel}
        setCategory={this.setCategory}
        setPlayMode={this.setPlayMode}
        markSettingsConfigured={this.markSettingsConfigured}
      />

    return (
      <Container className="mt-5">
        <Header />
        {display}
      </Container>
    )

  }
}

export default App;