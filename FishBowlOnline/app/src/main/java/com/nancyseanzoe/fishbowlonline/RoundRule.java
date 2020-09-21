package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
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
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;

import java.util.HashMap;
import java.util.Map;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class RoundRule extends AppCompatActivity {

    private static final String TAG = "RoundRule";
    private DatabaseReference database;
    private TextView description;
    private TextView roundTitle;
    private Button nextRound;
    private TextView team1Score;
    private TextView team2Score;

    private int currentRound;
    private String currentTeam;
    private int currentClueGiver;
    private GameInfo gameInfo;

    private static final String PLAYERS = "players";

    private SharedPreferences sharedPreferences;
    private String thisPlayer;
    private String roomCode;
    private String userTeam;
    private boolean isHost;
    private String thisPlayerRole;
    protected static final String CLUE_GIVER = "CLUE_GIVER";
    protected static final String GUESSER = "GUESSER";
    protected static final String OBSERVER = "OBSERVER";
    protected static final String CURRENTCLUEGIVER = "current_clue_givers";
    private final static String WORDS = "words";
    private final static String GUESSED = "guessedWords";
    private final static String REMAINING = "remainingWords";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_round_rule);
        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);

        roomCode = sharedPreferences.getString("room_code", "");
        thisPlayer = sharedPreferences.getString("user", "");
        userTeam = sharedPreferences.getString("team", "");
        isHost = sharedPreferences.getBoolean("is_host", false);

        initView();
        // set round rule description according to current round
        addGameInfoListener();
        addScoreListener();
    }

    private void initView(){
        database = FirebaseDatabase.getInstance().getReference();
        description = findViewById(R.id.round_rule);
        roundTitle = findViewById(R.id.round_number);
        nextRound = findViewById(R.id.nextRoundBtn);
        team1Score = findViewById(R.id.currentScore_team1);
        team2Score = findViewById(R.id.currentScore_team2);
        // if this player isn't the host, disable the "NEXT ROUND" button
        if (!isHost) {
            nextRound.setEnabled(false);
        }

    }

    private void addGameInfoListener(){
        database.child("current_games").child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                gameInfo = snapshot.getValue(GameInfo.class);
                currentRound = gameInfo.getCurrentRound();
                currentTeam = gameInfo.getCurrentTeam();
                if(isHost && currentRound != 1){
                    resetWords();
                }
                setRoundDescription();
                addClueGiverListener();
                addStartRoundListener();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "GAME_INFO Listener is cancelled: " + error.getMessage());
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
        database.child(CURRENTCLUEGIVER).child(roomCode).child(currentTeam).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                currentClueGiver = snapshot.getValue(Integer.class);
                addRoleListener();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "CLUE_GIVER Listener is cancelled: " + error.getMessage());
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

    private void addStartRoundListener() {
        database.child("current_games").child(roomCode).child("startRound").addValueEventListener(
            new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot snapshot) {
                    if (snapshot.getValue(boolean.class)) {
                        launchNextActivity();
                        // set startRound node back to false
                        database.child("current_games").child(roomCode).child("startRound").setValue(false);
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError error) {
                    Log.w(TAG, "onCancelled: ", error.toException());
                }
            });
    }

    private void resetWords(){
        final Map<String, Object> changeWords = new HashMap<>();
        database.child(WORDS).child(roomCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                DataSnapshot guessed = snapshot.child(GUESSED);
                for (DataSnapshot child : guessed.getChildren()) {
                    changeWords.put("/" + WORDS + "/" + roomCode + "/" + REMAINING + "/" + child.getKey(), child.getValue());
                    database.child(WORDS).child(roomCode).child(GUESSED).child(child.getKey()).removeValue();
                }
                database.updateChildren(changeWords);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    private void launchNextActivity(){
        if(thisPlayerRole.equals(CLUE_GIVER)) {
            Intent intent = new Intent(RoundRule.this, PlayerGivingClueActivity.class);
            startActivity(intent);
        } else if(thisPlayerRole.equals(GUESSER)) {
            Intent intent = new Intent(RoundRule.this, PlayerGuessingActivity.class);
            startActivity(intent);
        } else {
            Intent intent = new Intent(RoundRule.this, PlayerObserverActivity.class);
            startActivity(intent);
        }
    }

    public void advanceToRound(View view) {
        // update roundStart node
        database.child("current_games").child(roomCode).child("startRound").setValue(true);

    }

    private void setRoundDescription() {
        switch (currentRound) {
            case 1 :
                description.setText(R.string.round1_rule);
                roundTitle.setText(R.string.round_1);
                break;
            case 2 :
                description.setText(R.string.round2_rule);
                roundTitle.setText(R.string.round_2);
                break;
            case 3 :
                description.setText(R.string.round3_rule);
                roundTitle.setText(R.string.round_3);
                break;
            case 4 :
                description.setText(R.string.round4_rule);
                roundTitle.setText(R.string.round_4);
                break;
            default :
                break;
        }
    }


}