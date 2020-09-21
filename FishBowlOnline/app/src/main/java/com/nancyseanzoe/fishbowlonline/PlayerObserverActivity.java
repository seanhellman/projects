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

public class PlayerObserverActivity extends AppCompatActivity {

    private static final String TAG = "Player_Observer";

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

    private String roomCode;
    private SharedPreferences sharedPreferences;

    private ValueEventListener roundOverListener;
    private ValueEventListener timerListener;
    private ValueEventListener remainingWordsListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player_observer);

        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        roomCode = sharedPreferences.getString("room_code", "");
        database = FirebaseDatabase.getInstance().getReference();
        progressBar = (RoundProgressBar) findViewById(R.id.observe_progressBar);
        roundTextView = (TextView) findViewById(R.id.observe_round_number);
        wordsLeftTV = (TextView) findViewById(R.id.observeWordsLeft);
        addGameInfoListener();
        addRemainingWordsListener();
    }

    public void onClickRule(View view) {
        Intent intent = new Intent(this, RoundRule.class);
        startActivity(intent);
    }

    private void addGameInfoListener() {
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

    private void addTimerListener() {
         timerListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                progressBar.setProgress((int) snapshot.getValue(Integer.class));
                if(progressBar.getProgress() < 1000) {
                    Intent intent = new Intent(PlayerObserverActivity.this, TimeUpActivity.class);
                    nextActivity(intent);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Timer Listener is cancelled: " + error.getMessage());
            }
        };

        database.child("timers").child(roomCode).addValueEventListener(timerListener);
    }

    private void nextActivity(Intent intent) {
        closeListeners();
        startActivity(intent);
        PlayerObserverActivity.this.finish();
    }

    private void addRemainingWordsListener() {
        remainingWordsListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                int wordsLeft = (int) snapshot.getChildrenCount();
                wordsLeftTV.setText(String.valueOf(wordsLeft));
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        };
        database.child(WORDS).child(roomCode).child(REMAINING).addValueEventListener(remainingWordsListener);
    }

    private void roundOver() {
         roundOverListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if(snapshot.getChildrenCount() == 0 && currentRound == maxRound) {
                    Intent intent = new Intent(PlayerObserverActivity.this, FinalScoreActivity.class);
                    nextActivity(intent);
                } else if(snapshot.getChildrenCount() == 0) {
                    Intent intent = new Intent(PlayerObserverActivity.this, RoundRule.class);
                    nextActivity(intent);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Game Info Listener is cancelled: " + error.getMessage());
            }
        };

        database.child("words").child(roomCode).child(REMAINING).addValueEventListener(roundOverListener);
    }

    private void setRoundNumber() {
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

    private void closeListeners() {
        database.child("words").child(roomCode).child(REMAINING).removeEventListener(roundOverListener);
        database.child("timers").child(roomCode).removeEventListener(timerListener);
        database.child(WORDS).child(roomCode).child(REMAINING).removeEventListener(remainingWordsListener);
    }
}