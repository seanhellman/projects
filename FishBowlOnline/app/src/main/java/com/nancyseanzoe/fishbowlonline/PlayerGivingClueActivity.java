package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import static com.nancyseanzoe.fishbowlonline.RoundRule.CURRENTCLUEGIVER;
import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class PlayerGivingClueActivity extends AppCompatActivity implements SensorEventListener {

    private static final String TAG = "Giving_Clue";

    // time related
    private CountDownTimer timer;
    private int timeLimit;

    // View widgets
    private TextView countdown;
    private Button skipBtn;
    private Button correctBtn;
    private TextView guessingWordTV;
    private TextView wordsLeftTV;
    private TextView teamScoreTV;
    private TextView roundNumberTV;
    private TextView teamNameTV;

    // words related
    private List<String> wordsLeftList = new ArrayList<>();
    private List<String> remainingKeys = new ArrayList<>();
    private List<String> guessedList = new ArrayList<>();
    private List<String> guessedKeys = new ArrayList<>();
    private boolean[] finished;
    private ArrayList<Integer> rearrangedListIndex;
    private Iterator<Integer> itr;
    private int currentWordIndex;
    private int wordsLeft;

    // database retrieving
    private DatabaseReference database;
    private GameInfo gameInfo;
    private int currentRound;
    private int maxRound;
    private String currentGuessingTeam;
    private int currentClueGiver;
    private int currentTeamScore;
    private int numPlayers;
    private final static String WORDS = "words";
    private final static String GUESSED = "guessedWords";
    private final static String REMAINING = "remainingWords";
    private static final String TEAM1 = "team1";
    private static final String TEAM2 = "team2";
    // Listeners
    ValueEventListener gameInfoListener;
    ValueEventListener wordsListener;

    private SharedPreferences sharedPreferences;
    private String roomCode;
    private String userTeam;
    private String thisPlayer;

    private SensorManager sensorManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player_giving_clue);
        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        roomCode = sharedPreferences.getString("room_code", "");
        userTeam = sharedPreferences.getString("team", "");
        thisPlayer = sharedPreferences.getString("user", "");
        database = FirebaseDatabase.getInstance().getReference();
        initView();
        addNumPlayerListener();
        addGameInfoListener();
    }

    private void initView(){
        countdown = findViewById(R.id.clue_countdown);
        roundNumberTV = (TextView) findViewById(R.id.clue_round_number);
        guessingWordTV = (TextView) findViewById(R.id.clue_guessing_word);
        wordsLeftTV = (TextView) findViewById(R.id.clue_words_left_num);
        teamScoreTV = (TextView) findViewById(R.id.clue_currentScore_num);
        skipBtn = (Button) findViewById(R.id.clue_btn_skip);
        correctBtn = (Button) findViewById(R.id.clue_btn_correct);
        teamNameTV = (TextView) findViewById(R.id.clue_team_name);
        teamNameTV.setText(userTeam);

        addTeamScoreListener();

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        sensorManager.registerListener(this, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                SensorManager.SENSOR_DELAY_NORMAL);
    }

    private void addTeamScoreListener() {
        database.child("scores").child(roomCode).child(userTeam).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                currentTeamScore = snapshot.getValue(Integer.class);
                teamScoreTV.setText(currentTeamScore + "");
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    private void addGameInfoListener() {
        gameInfoListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                gameInfo = snapshot.getValue(GameInfo.class);
                timeLimit = gameInfo.getTimePerPerson();
                currentRound = gameInfo.getCurrentRound();
                maxRound = gameInfo.getNumRounds();
                currentGuessingTeam = gameInfo.getCurrentTeam();

                setRoundNumber();
                addWordsListener();
                addRemainingWordsListener();
                initTimer();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Timer limit Listener is cancelled: " + error.getMessage());
            }
        };
        // Gets initial values for game
        database.child("current_games").child(roomCode).addListenerForSingleValueEvent(gameInfoListener);

        // Get current clue giver
        database.child(CURRENTCLUEGIVER).child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                currentClueGiver = snapshot.child(userTeam).getValue(Integer.class);

                database.child(CURRENTCLUEGIVER).child(roomCode).child(currentGuessingTeam)
                        .setValue(1 + currentClueGiver % numPlayers);
                database.child("current_games").child(roomCode).child("currentTeam").setValue(
                        userTeam.equals(TEAM1) ? TEAM2 : TEAM1);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    private void addRemainingWordsListener() {
        DatabaseReference remainingWordsRef = database.child(WORDS).child(roomCode).child(REMAINING);
        wordsListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                wordsLeft = (int) snapshot.getChildrenCount();
                wordsLeftTV.setText(String.valueOf(wordsLeft));
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        };
        remainingWordsRef.addValueEventListener(wordsListener);
    }

    private void initTimer(){
        timer = new CountDownTimer(timeLimit * 1000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                countdown.setText(formatTime(millisUntilFinished));
                database.child("timers").child(roomCode).setValue(millisUntilFinished);
            }

            @Override
            public void onFinish() {
                Log.w(TAG, "on finish called");
                countdown.setText("00 : 00");
                database.child("timers").child(roomCode).setValue(0);
                turnOver();
            }
        };
        timer.start();
    }

    private void addWordsListener(){
        database.child(WORDS).child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                DataSnapshot guessed = snapshot.child(GUESSED);
                DataSnapshot remaining = snapshot.child(REMAINING);
                for (DataSnapshot child : remaining.getChildren()) {
                    wordsLeftList.add(child.getValue(String.class));
                    remainingKeys.add(child.getKey());
                }
                for (DataSnapshot child : guessed.getChildren()) {
                    guessedList.add(child.getValue(String.class));
                    guessedKeys.add(child.getKey());
                }
                initAction();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled:", error.toException());
            }
        });
    }

    private void initAction(){
        wordsLeft = wordsLeftList.size();
        finished = new boolean[wordsLeft];
        rearrangedListIndex = rearrangeWords(wordsLeft);
        itr = rearrangedListIndex.iterator();
        if(itr.hasNext()){
            currentWordIndex = itr.next();
            guessingWordTV.setText(wordsLeftList.get(currentWordIndex));
            wordsLeftTV.setText(wordsLeft + "");
        }

        skipBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                nextWord();
            }
        });
        correctBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            finished[currentWordIndex] = true;
            wordsLeft--;
            // move word from remainingWords node to guessedWords node
            DatabaseReference wordsRef = database.child(WORDS).child(roomCode);
            wordsRef.child(REMAINING).child(remainingKeys.get(currentWordIndex)).removeValue();
            wordsRef.child(GUESSED).child(remainingKeys.get(currentWordIndex)).setValue(wordsLeftList.get(currentWordIndex));

            currentTeamScore++;
            teamScoreTV.setText(currentTeamScore + "");
            if(wordsLeft == 0){
                roundOver();
            }
            wordsLeftTV.setText(wordsLeft + "");
            updateScore();
            nextWord();
            }
        });
    }

    private void updateScore() {
        database.child("scores").child(roomCode).child(userTeam).setValue(currentTeamScore);
    }

    private void addNumPlayerListener(){
        database.child("players").child(roomCode).child(userTeam).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                numPlayers  = (int) snapshot.getChildrenCount();
                Log.w(TAG, "NumPlayers onChanged:" + numPlayers);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled:", error.toException());
            }
        });
    }

    // Methods for moving to next activity
    private void turnOver() {
        timer.cancel();
        removeListeners();
        Intent intent = new Intent(PlayerGivingClueActivity.this, TimeUpActivity.class);
        startActivity(intent);
        this.finish();
    }

    private void roundOver(){
        // game finished
        if(currentRound >= maxRound){
            database.child("current_games").child(roomCode).child("startGame").setValue(false);
            timer.cancel();
            removeListeners();
            Intent intent = new Intent(this, FinalScoreActivity.class);
            startActivity(intent);
            this.finish();
            return;
        } else {
            // change current Round
            database.child("current_games").child(roomCode).child("currentRound").setValue(currentRound + 1);
            // update current guesser
            database.child(CURRENTCLUEGIVER).child(roomCode).child(currentGuessingTeam).setValue(1 + currentClueGiver  % numPlayers);
            // change currentTeam
            database.child("current_games").child(roomCode).child("currentTeam").setValue(
                    currentGuessingTeam.equals(TEAM1) ? TEAM2 : TEAM1);
        }
        timer.cancel();
        removeListeners();
        Intent intent = new Intent(this, RoundRule.class);
        startActivity(intent);
        this.finish();
    }

    private void removeListeners(){
        database.child("current_games").child(roomCode).removeEventListener(gameInfoListener);
        database.child(WORDS).child(roomCode).child(REMAINING).removeEventListener(wordsListener);
    }

    // Methods for re-arranging current words to give to clue giver
    private ArrayList<Integer> rearrangeWords(int n){
        ArrayList<Integer> res = new ArrayList<>();
        for(int i = 0; i < n; i++){
            res.add(i);
        }
        Collections.shuffle(res);
        return res;
    }

    private void nextWord(){
        if(wordsLeft > 0){
            if(!itr.hasNext()){
                itr = rearrangedListIndex.iterator();
            }
            currentWordIndex = itr.next();
            while(finished[currentWordIndex]){
                if(!itr.hasNext()){
                    itr = rearrangedListIndex.iterator();
                }
                currentWordIndex = itr.next();
            }
            guessingWordTV.setText(wordsLeftList.get(currentWordIndex));
        }
    }

    // View or formatting methods
    private void setRoundNumber(){
        switch (currentRound){
            case 1 :
                roundNumberTV.setText(R.string.round_1);
                break;
            case 2 :
                roundNumberTV.setText(R.string.round_2);
                break;
            case 3 :
                roundNumberTV.setText(R.string.round_3);
                break;
            case 4 :
                roundNumberTV.setText(R.string.round_4);
                break;
            default :
                break;
        }
    }

    private String formatTime(long millisecond){
        int minute;
        int second;
        minute = (int) (millisecond / 1000 / 60);
        second = (int) (millisecond / 1000 % 60);

        if (minute < 10) {
            if (second < 10) {
                return "0" + minute + " : " + "0" + second;
            } else {
                return "0" + minute + " : " + second;
            }
        }else {
            if (second < 10) {
                return minute + " : " + "0" + second;
            } else {
                return minute + " : " + second;
            }
        }
    }

    // To see rule
    public void onClickRule(View view){
        Intent intent = new Intent(this, RoundRule.class);
        startActivity(intent);
    }

    // Sensor methods
    @Override
    public void onSensorChanged(SensorEvent event) {
        if(event.sensor.getType() == Sensor.TYPE_ACCELEROMETER){
            float x = event.values[0];

            if(x < -5){
                correctBtn.performClick();
            }else if(x > 4.5){
                skipBtn.performClick();
            }

        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    protected void onDestroy() {
        sensorManager.unregisterListener(this);
        timer.cancel();
        super.onDestroy();
    }
}