package com.nancyseanzoe.fishbowlonline;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.RoundScore;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class FinalScoreActivity extends AppCompatActivity {

    private static final String TAG = "FinalScoreActivity";

    private final static int TROPHY_UNICODE = 0x1F3C5;

    TextView team1Total;
    TextView team2Total;
    TextView team1Trophy;
    TextView team2Trophy;

    private String roomCode;
    private int team1Score;
    private int team2Score;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_final_score);

        team1Total = findViewById(R.id.team1TotalScore);
        team1Trophy = findViewById(R.id.team1Trophy);
        team2Total = findViewById(R.id.team2TotalScore);
        team2Trophy = findViewById(R.id.team2Trophy);

        SharedPreferences sharedPreferences =
                getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        roomCode = sharedPreferences.getString("room_code", "");

        Log.d(TAG, "onCreate: ");
        getScoresFromDb();
    }

    private void getScoresFromDb() {
        DatabaseReference dbScores = FirebaseDatabase.getInstance().getReference().child("scores").child(roomCode);
        dbScores.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                team1Score = snapshot.child("team1").getValue(Integer.class);
                team2Score = snapshot.child("team2").getValue(Integer.class);
                showScores();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        });
    }

    private void showScores() {
        team1Total.setText(String.valueOf(team1Score));
        team2Total.setText(String.valueOf(team2Score));
        String trophy = new String(Character.toChars(TROPHY_UNICODE));
        if (team1Score > team2Score) {
            team1Trophy.setText(trophy);
        } else if (team2Score > team1Score) {
            team2Trophy.setText(trophy);
        } else {
            team1Trophy.setText(trophy);
            team2Trophy.setText(trophy);
        }
    }

    public void handlePlayAgain(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

}