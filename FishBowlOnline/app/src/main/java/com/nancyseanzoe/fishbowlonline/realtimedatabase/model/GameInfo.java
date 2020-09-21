package com.nancyseanzoe.fishbowlonline.realtimedatabase.model;

public class GameInfo {
    public int numRounds;
    public int timePerPerson;
    public int wordsPerPerson;
    public int currentRound;
    public String currentTeam;
    public boolean startGame;
    public int numPlayers;
    public boolean addWords;
    public boolean startRound;
    public boolean startTurn;

    public GameInfo() {
    }

    public GameInfo(int numRounds, int timePerPerson, int wordsPerPerson) {
        this.numRounds = numRounds;
        this.timePerPerson = timePerPerson;
        this.wordsPerPerson = wordsPerPerson;
        this.currentRound = 1;
        this.currentTeam = "team1";
        this.startGame = false;
        this.numPlayers = 0;
        this.addWords = false;
        this.startRound = false;
        this.startTurn = false;
    }

    public int getNumRounds() {
        return numRounds;
    }

    public int getTimePerPerson() {
        return timePerPerson;
    }

    public int getWordsPerPerson() {
        return wordsPerPerson;
    }

    public int getCurrentRound() {
        return currentRound;
    }

    public String getCurrentTeam() {
        return currentTeam;
    }

    public boolean isStartGame() {
        return startGame;
    }

    public int getNumPlayers() {
        return numPlayers;
    }

    public boolean isAddWords() {
        return addWords;
    }

    public boolean isStartRound() { return startRound; }

    public boolean isStartTurn() { return startTurn; }

    public void setNumRounds(int numRounds) {
        this.numRounds = numRounds;
    }

    public void setTimePerPerson(int timePerPerson) {
        this.timePerPerson = timePerPerson;
    }

    public void setWordsPerPerson(int wordsPerPerson) {
        this.wordsPerPerson = wordsPerPerson;
    }

    public void setCurrentRound(int currentRound) {
        this.currentRound = currentRound;
    }

    public void setCurrentTeam(String currentTeam) {
        this.currentTeam = currentTeam;
    }

    public void setStartGame(boolean startGame) {
        this.startGame = startGame;
    }

    public void setNumPlayers(int numPlayers) {
        this.numPlayers = numPlayers;
    }

    public void setAddWords(boolean addWords) {
        this.addWords = addWords;
    }

    public void setStartRound(boolean startRound) { this.startRound = startRound; }

    public void setStartTurn(boolean startTurn) { this.startTurn = startTurn; }
}

