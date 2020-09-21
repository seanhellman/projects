package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;
import com.nancyseanzoe.fishbowlonline.widgets.RoundProgressBar;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class PlayerGuessingActivity extends AppCompatActivity {

    private static final String TAG = "Player_Guessing";

    private TextView roundTextView;
    private int currentRound;
    private RoundProgressBar progressBar;
    private int timeLimit;
    private DatabaseReference database;
    private GameInfo gameInfo;
    private int maxRound;
    private static final String WORDS = "words";
    private static final String REMAINING = "remainingWords";
    private TextView wordsLeftTV;

    private TextView currentScoreTextView;
    private String roomCode;
    private SharedPreferences sharedPreferences;

    ValueEventListener scoreListener;
  
    private String userTeam;

    // listeners
    ValueEventListener wordsListener;
    ValueEventListener timerListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player_guessing);

        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        roomCode = sharedPreferences.getString("room_code", "");
        userTeam = sharedPreferences.getString("team", "");
        database = FirebaseDatabase.getInstance().getReference();
        progressBar = (RoundProgressBar) findViewById(R.id.guess_progressBar);
        roundTextView = (TextView) findViewById(R.id.guess_round_number);
        wordsLeftTV = (TextView) findViewById(R.id.guessWordsLeft);
        currentScoreTextView = (TextView) findViewById(R.id.guess_currentScore_num);
        addScoreListener();
        addGameInfoListener();
        addRemainingWordsListener();
    }

    public void onClickRule(View view){
        Intent intent = new Intent(this, RoundRule.class);
        startActivity(intent);
    }

    private void addTimerListener(){
        timerListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                progressBar.setProgress((int) snapshot.getValue(Integer.class));
                if(progressBar.getProgress() < 1000){
                    removeListeners();
                    Intent intent = new Intent(PlayerGuessingActivity.this, TimeUpActivity.class);
                    startActivity(intent);
                    PlayerGuessingActivity.this.finish();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Timer Listener is cancelled: " + error.getMessage());
            }
        };
        database.child("timers").child(roomCode).addValueEventListener(timerListener);
    }

    private void addScoreListener() {
        scoreListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                currentScoreTextView.setText(snapshot.getValue(Integer.class).toString());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "score Listener is cancelled: " + error.getMessage());
            }
        };

        database.child("scores").child(roomCode).child(userTeam).addValueEventListener(scoreListener);
    }

    private void addGameInfoListener(){
        database.child("current_games").child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                gameInfo = snapshot.getValue(GameInfo.class);
                timeLimit = gameInfo.getTimePerPerson();
                currentRound = gameInfo.getCurrentRound();
                maxRound = gameInfo.getNumRounds();
                setRoundNumber();
                progressBar.setProgressMax(timeLimit * 1000);
                addTimerListener();
                roundOver();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Game Info Listener is cancelled: " + error.getMessage());
            }
        });
    }

    private void addRemainingWordsListener() {
        DatabaseReference remainingWordsRef = database.child(WORDS).child(roomCode).child(REMAINING);
        remainingWordsRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                int wordsLeft = (int) snapshot.getChildrenCount();
                wordsLeftTV.setText(String.valueOf(wordsLeft));
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        });
    }

    private void roundOver(){
        wordsListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if(snapshot.getChildrenCount() == 0 && currentRound == maxRound){
                    removeListeners();
                    Intent intent = new Intent(PlayerGuessingActivity.this, FinalScoreActivity.class);
                    startActivity(intent);
                    PlayerGuessingActivity.this.finish();
                }else if(snapshot.getChildrenCount() == 0){
                    removeListeners();
                    Intent intent = new Intent(PlayerGuessingActivity.this, RoundRule.class);
                    startActivity(intent);
                    PlayerGuessingActivity.this.finish();
                }

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Game Info Listener is cancelled: " + error.getMessage());
            }
        };

        database.child("words").child(roomCode).child(REMAINING).addValueEventListener(wordsListener);
    }

    private void removeListeners(){
        database.child("words").child(roomCode).child(REMAINING).removeEventListener(wordsListener);
        database.child("timers").child(roomCode).removeEventListener(timerListener);
        database.child("scores").child(roomCode).child(userTeam).removeEventListener(scoreListener);
    }

    private void setRoundNumber(){
        switch (currentRound){
            case 1 :
                roundTextView.setText(R.string.round_1);
                break;
            case 2 :
                roundTextView.setText(R.string.round_2);
                break;
            case 3 :
                roundTextView.setText(R.string.round_3);
                break;
            case 4 :
                roundTextView.setText(R.string.round_4);
                break;
            default :
                break;
        }
    }

}