package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.content.ClipData;
import android.content.ClipDescription;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.DragEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.MutableData;
import com.google.firebase.database.Transaction;
import com.google.firebase.database.ValueEventListener;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

/**
 * Code citations:
 * (1) Android Drag and Drop Guide: https://developer.android.com/guide/topics/ui/drag-drop#HandleStart
 * (2) AndroidDevs Drag and Drop Video Tutorial: https://www.youtube.com/watch?v=8hzJNjj8Zck
 */
public class AssignTeamsActivity extends AppCompatActivity {

    private static final String TAG = "AssignTeamsActivity";
    private static final String PLAYERS = "players";
    private static final String TEAM1 = "team1";
    private static final String TEAM2 = "team2";
    private static final int MAX_PLAYERS_PER_TEAM = 8;

    private SharedPreferences sharedPreferences;
    private String roomCode;
    private static DatabaseReference db;
    private DatabaseReference addWordsRef;
    private static String thisPlayer;
    private static String thisPlayerKey;
    private boolean addedToDb = false;
    private static ArrayList<String> team1Players = new ArrayList<>();
    private static ArrayList<String> team2Players = new ArrayList<>();
    private static ArrayList<TextView> team1TextViews = new ArrayList<>();
    private static ArrayList<TextView> team2TextViews = new ArrayList<>();

    ConstraintLayout team1;
    ConstraintLayout team2;
    TextView roomCodeTextView;
    TextView team1Player1, team1Player2, team1Player3, team1Player4, team1Player5, team1Player6,
            team1Player7, team1Player8;
    TextView team2Player1, team2Player2, team2Player3, team2Player4, team2Player5, team2Player6,
            team2Player7, team2Player8;
    Button submitButton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_assign_teams);

        findViews();
        setRoomCode();
        roomCodeTextView.setText(getResources().getString(R.string.display_room_code, roomCode));

        Log.d(TAG, "onCreate: is_host = " + sharedPreferences.getBoolean("is_host", false));
        if (!sharedPreferences.getBoolean("is_host", false)) {
            submitButton.setEnabled(false);
        }

        db = FirebaseDatabase.getInstance().getReference().child(PLAYERS).child(roomCode);

        db.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                DataSnapshot team1 = snapshot.child(TEAM1);
                DataSnapshot team2 = snapshot.child(TEAM2);
                team1Players.clear();
                team2Players.clear();
                for (DataSnapshot child : team1.getChildren()) {
                    team1Players.add(child.getValue(String.class));
                    if (child.getValue(String.class).equals(thisPlayer)) {
                        thisPlayerKey = child.getKey();
                        Log.d(TAG, "onDataChange: player key = " + thisPlayerKey);
                    }
                }
                for (DataSnapshot child : team2.getChildren()) {
                    team2Players.add(child.getValue(String.class));
                    if (child.getValue(String.class).equals(thisPlayer)) {
                        thisPlayerKey = child.getKey();
                        Log.d(TAG, "onDataChange: player key = " + thisPlayerKey);
                    }
                }
                // add player to db if not yet added
                if (!addedToDb) {
                    addNewPlayerToGame();
                    addedToDb = true;
                }
                Log.d(TAG, "onDataChange: " + team1Players.toString());
                Log.d(TAG, "onDataChange: " + team2Players.toString());
                for (int i = 0; i < MAX_PLAYERS_PER_TEAM; i++) {
                    TextView textViewTeam1 = team1TextViews.get(i);
                    TextView textViewTeam2 = team2TextViews.get(i);
                    if (i >= team1Players.size()) {
                        textViewTeam1.setText(null);
                        unsetBackgroundAndPadding(textViewTeam1);
                    }
                    if (i >= team2Players.size()) {
                        textViewTeam2.setText(null);
                        unsetBackgroundAndPadding(textViewTeam2);
                    }
                }
                setPlayerTextViews();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled:", error.toException());
            }
        });

        addWordsRef = FirebaseDatabase.getInstance().getReference().child("current_games").child(roomCode)
                .child("addWords");

        addWordsRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.getValue(boolean.class)) {
                    startAddWordsActivity();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        });

        DragEventListener dragListener = new DragEventListener();
        team1.setOnDragListener(dragListener);
        team2.setOnDragListener(dragListener);
    }

    private void startAddWordsActivity() {
        // add player's team to sharedPreferences
        // Update SharedPreferences with room code to be access by other activities
        SharedPreferences.Editor editor = sharedPreferences.edit();
        if (team1Players.contains(thisPlayer)) editor.putString("team", "team1");
        else editor.putString("team", "team2");
        editor.commit();

        // start AddWordsActivity
        Intent intent = new Intent(this, AddWordsActivity.class);
        startActivity(intent);
    }

    public void handleSubmitButton(View view) {
        addWordsRef.setValue(true);
    }

    private void addNewPlayerToGame() {
        Log.d(TAG, "addNewPlayerToGame: team 1 size = " + team1Players.size());
        Log.d(TAG, "addNewPlayerToGame: team 2 size = " + team2Players.size());
        if (team1Players.size() <= team2Players.size()) {
            int playerNum = team1Players.size() + 1;
            db.child(TEAM1).child(String.valueOf(playerNum)).setValue(thisPlayer);
            team1Players.add(thisPlayer);
        } else {
            int playerNum = team2Players.size() + 1;
            db.child(TEAM2).child(String.valueOf(playerNum)).setValue(thisPlayer);
            team2Players.add(thisPlayer);
        }
        updateNumPlayers();
    }

    private void updateNumPlayers() {
        DatabaseReference dbNumPlayers =
                FirebaseDatabase.getInstance().getReference().child("current_games").child(roomCode)
                        .child("numPlayers");
        dbNumPlayers.runTransaction(new Transaction.Handler() {
            @NonNull
            @Override
            public Transaction.Result doTransaction(@NonNull MutableData currentData) {
                Integer currentNumPlayers = currentData.getValue(Integer.class);
                assert (currentNumPlayers != null);
                currentData.setValue(currentNumPlayers + 1);
                return Transaction.success(currentData);
            }

            @Override
            public void onComplete(@Nullable DatabaseError error, boolean committed,
                                   @Nullable DataSnapshot currentData) {
                if (error != null) Log.w(TAG, "onComplete: ", error.toException());
            }
        });
    }

    private void setRoomCode() {
        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        roomCode = sharedPreferences.getString("room_code", "");
        thisPlayer = sharedPreferences.getString("user", "");
    }

    private static void setPlayerTextViews() {
        for (int i = 0; i < team1Players.size(); i++) {
            TextView textView = team1TextViews.get(i);
            String player = team1Players.get(i);
            textView.setText(player);
            setBackgroundAndPadding(textView);
            if (player.equals(thisPlayer)) {
                makeDraggable(textView);
            }
        }

        for (int i = 0; i < team2Players.size(); i++) {
            TextView textView = team2TextViews.get(i);
            String player = team2Players.get(i);
            textView.setText(player);
            setBackgroundAndPadding(textView);
            if (player.equals(thisPlayer)) {
                makeDraggable(textView);
            }
        }
    }

    private static void setBackgroundAndPadding(TextView textView) {
        textView.setBackgroundColor(Color.parseColor("#FFFFFF"));
        textView.setPadding(32, 16, 32, 16);
    }

    private static void unsetBackgroundAndPadding(TextView textView) {
        textView.setBackgroundColor(0);
        textView.setPadding(0, 0, 0, 0);
    }

    private static void makeDraggable(TextView player) {
        player.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                ClipData data = ClipData.newPlainText("name", ((TextView) v).getText());

                View.DragShadowBuilder shadowBuilder = new View.DragShadowBuilder(v);

                v.startDragAndDrop(data, shadowBuilder, v, 0);

                v.setVisibility(View.INVISIBLE);
                return true;
            }
        });
    }

    private void findViews() {
        team1 = findViewById(R.id.team1Layout);
        team2 = findViewById(R.id.team2Layout);

        roomCodeTextView = findViewById(R.id.roomCode);

        team1Player1 = findViewById(R.id.team1Player1);
        team1TextViews.add(team1Player1);
        team1Player2 = findViewById(R.id.team1Player2);
        team1TextViews.add(team1Player2);
        team1Player3 = findViewById(R.id.team1Player3);
        team1TextViews.add(team1Player3);
        team1Player4 = findViewById(R.id.team1Player4);
        team1TextViews.add(team1Player4);
        team1Player5 = findViewById(R.id.team1Player5);
        team1TextViews.add(team1Player5);
        team1Player6 = findViewById(R.id.team1Player6);
        team1TextViews.add(team1Player6);
        team1Player7 = findViewById(R.id.team1Player7);
        team1TextViews.add(team1Player7);
        team1Player8 = findViewById(R.id.team1Player8);
        team1TextViews.add(team1Player8);

        team2Player1 = findViewById(R.id.team2Player1);
        team2TextViews.add(team2Player1);
        team2Player2 = findViewById(R.id.team2Player2);
        team2TextViews.add(team2Player2);
        team2Player3 = findViewById(R.id.team2Player3);
        team2TextViews.add(team2Player3);
        team2Player4 = findViewById(R.id.team2Player4);
        team2TextViews.add(team2Player4);
        team2Player5 = findViewById(R.id.team2Player5);
        team2TextViews.add(team2Player5);
        team2Player6 = findViewById(R.id.team2Player6);
        team2TextViews.add(team2Player6);
        team2Player7 = findViewById(R.id.team2Player7);
        team2TextViews.add(team2Player7);
        team2Player8 = findViewById(R.id.team2Player8);
        team2TextViews.add(team2Player8);

        submitButton = findViewById(R.id.addWordsButton);
    }

    protected static class DragEventListener implements View.OnDragListener {

        @Override
        public boolean onDrag(View v, DragEvent event) {
            final int action = event.getAction();
            TextView textView = (TextView) event.getLocalState();

            switch (action) {
                case DragEvent.ACTION_DRAG_STARTED:
                    return event.getClipDescription()
                            .hasMimeType(ClipDescription.MIMETYPE_TEXT_PLAIN);
                case DragEvent.ACTION_DRAG_ENTERED:
                case DragEvent.ACTION_DRAG_EXITED:
                    v.invalidate();
                    return true;
                case DragEvent.ACTION_DRAG_ENDED:
                    v.invalidate();
                    if (!event.getResult()) {
                        textView.setVisibility(View.VISIBLE);
                    }
                    return true;
                case DragEvent.ACTION_DRAG_LOCATION:
                    return true;
                case DragEvent.ACTION_DROP:
                    ClipData.Item item = event.getClipData().getItemAt(0);
                    String player = (String) item.getText();
                    Log.d(TAG, "onDrag: player = " + player);
                    v.invalidate();
                    Log.d(TAG, "onDrag: " + textView.toString());
                    ViewGroup parent = (ViewGroup) textView.getParent();
                    Log.d(TAG, "onDrag: parent =" + parent.toString());
                    ConstraintLayout layout = (ConstraintLayout) v;
                    Log.d(TAG, "onDrag: dropped on view =" + layout.toString());
                    if (v.equals(parent)) {
                        textView.setVisibility(View.VISIBLE);
                        return true;
                    }
                    if (team1Players.contains(player)) {
                        Log.d(TAG, "onDrag: player is on team 1");
                        db.child(TEAM1).child(thisPlayerKey).removeValue();
                        int playerNum = team2Players.size() + 1;
                        db.child(TEAM2).child(String.valueOf(playerNum)).setValue(thisPlayer);
                    } else {
                        Log.d(TAG, "onDrag: player is on team 2");
                        db.child(TEAM2).child(thisPlayerKey).removeValue();
                        int playerNum = team1Players.size() + 1;
                        db.child(TEAM1).child(String.valueOf(playerNum)).setValue(thisPlayer);
                    }
                    textView.setVisibility(View.VISIBLE);
                    return true;
            }
            return false;
        }
    }
}