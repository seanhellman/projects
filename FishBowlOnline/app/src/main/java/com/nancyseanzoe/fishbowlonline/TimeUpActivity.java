package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.MutableData;
import com.google.firebase.database.Transaction;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class TimeUpActivity extends AppCompatActivity {

    // activity tag
    private static final String TAG = "TimeUpActivity";

    // textview
    TextView team1Score;
    TextView team2Score;

    // shared prefs
    private String thisPlayer;
    private String roomCode;
    private String userTeam;
    private int numPlayers;
    private boolean isHost;

    // constants
    protected static final String CLUE_GIVER = "CLUE_GIVER";
    protected static final String GUESSER = "GUESSER";
    protected static final String OBSERVER = "OBSERVER";
    private static final String PLAYERS = "players";
    private static final String TEAM1 = "team1";
    private static final String TEAM2 = "team2";

    // database
    private DatabaseReference database;
    protected static final String CURRENT_CLUE_GIVER = "current_clue_givers";
    private String thisPlayerRole;
    private String currentTeam;
    private int maxTimer;
    private GameInfo gameInfo;
    private int currentClueGiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_time_up);

        // shared prefs
        SharedPreferences sharedPreferences =
                getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        team1Score = findViewById(R.id.timeup_currentScore_team1);
        team2Score = findViewById(R.id.timeup_currentScore_team2);
        roomCode = sharedPreferences.getString("room_code", "");
        thisPlayer = sharedPreferences.getString("user", "");
        userTeam = sharedPreferences.getString("team", "");
        isHost = sharedPreferences.getBoolean("is_host", false);

        database = FirebaseDatabase.getInstance().getReference();

        Button nextRoundButton = (Button) findViewById(R.id.timeup_nextRoundBtn);
        if (!isHost) nextRoundButton.setEnabled(false);

        addGameInfoListener();
        addScoreListener();
    }

    // the onclick listener for button
    // copied from RoundRule
    public void advanceToRound(View view) {
        database.child("timers").child(roomCode).setValue(maxTimer);
        database.child("current_games").child(roomCode).child("startTurn").setValue(true);
    }

    private void startNextRound() {
        database.child("current_games").child(roomCode).child("startTurn").setValue(false);
        if(thisPlayerRole.equals(CLUE_GIVER)) {
            Intent intent = new Intent(this, PlayerGivingClueActivity.class);
            startActivity(intent);
        } else if(thisPlayerRole.equals(GUESSER)) {
            Intent intent = new Intent(this, PlayerGuessingActivity.class);
            startActivity(intent);
        } else {
            Intent intent = new Intent(this, PlayerObserverActivity.class);
            startActivity(intent);
        }
    }

    private void addFetchDataListener() {
        database.child("current_games").child(roomCode).child("fetchData").addValueEventListener(
                new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        boolean fetch = (boolean) snapshot.getValue();
                        if (fetch) {
                            addGameInfoListener();
                            addScoreListener();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                        Log.w(TAG, "onCancelled: ", error.toException());
                    }
                });
    }

    private void addGameInfoListener(){
        database.child("current_games").child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                gameInfo = snapshot.getValue(GameInfo.class);
                currentTeam = gameInfo.getCurrentTeam();
                maxTimer = gameInfo.getTimePerPerson() * 1000;
                numPlayers = gameInfo.getNumPlayers();
                Log.d(TAG, "onDataChange: currentTeam = " + currentTeam);
                addClueGiverListener();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "GAME_INFO Listener is cancelled: " + error.getMessage());
            }
        });
    }

    private void addRoleListener() {
        database.child(PLAYERS).child(roomCode).child(currentTeam).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                Log.w(TAG, "ADD ROLE LISTENER: currentTeam -- " + currentTeam);
                Log.w(TAG, "ADD ROLE LISTENER: userTeam -- " + userTeam);
                if (currentTeam.equals(userTeam)) {
                    for (DataSnapshot child : snapshot.getChildren()) {
                        if (child.getValue(String.class).equals(thisPlayer) && child.getKey().equals(String.valueOf(currentClueGiver))) {
                            thisPlayerRole = CLUE_GIVER;
                            return;
                        } else{
                            thisPlayerRole = GUESSER;
                        }
                    }
                } else {
                    thisPlayerRole = OBSERVER;
                }
                Log.w(TAG, "THIS PLAYER ROLE " + thisPlayerRole);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled:", error.toException());
            }
        });
    }

    private void addScoreListener() {
        database.child("scores").child(roomCode).addListenerForSingleValueEvent((new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                team1Score.setText(snapshot.child("team1").getValue(Integer.class).toString());
                team2Score.setText(snapshot.child("team2").getValue(Integer.class).toString());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "Score Listener is cancelled: " + error.getMessage());
            }
        }));
    }

    private void addClueGiverListener(){
        database.child(
                CURRENT_CLUE_GIVER).child(roomCode).child(currentTeam).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                currentClueGiver = snapshot.getValue(Integer.class);
                addRoleListener();
                addStartTurnListener();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "CLUE_GIVER Listener is cancelled: " + error.getMessage());
            }
        });
    }

    private void addStartTurnListener() {
        database.child("current_games").child(roomCode).child("startTurn").addValueEventListener(
                new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if (snapshot.getValue(boolean.class)) startNextRound();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {

                    }
                });
    }
}