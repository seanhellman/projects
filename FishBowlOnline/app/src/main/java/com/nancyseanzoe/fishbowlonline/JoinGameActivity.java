package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.HashSet;
import java.util.Set;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class JoinGameActivity extends AppCompatActivity {

    private static final String TAG = "JOIN_GAME";

    private SharedPreferences sharedPreferences;
    private DatabaseReference database;
    private Set<String> existingRoomCode;
    private Set<String> existingUsers;
    private Boolean usersFetched;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_join_game);

        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        database = FirebaseDatabase.getInstance().getReference();
        existingRoomCode = new HashSet<>();
        usersFetched = false;

        ValueEventListener roomCodeListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for(DataSnapshot code : snapshot.getChildren()){
                    existingRoomCode.add(code.getKey());
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "getRoomCode:onCancelled", error.toException());
            }
        };
        database.child("current_games").addValueEventListener(roomCodeListener);

        findViewById(R.id.enter_game_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String roomCode = ((EditText) findViewById(R.id.room_code_edit_text)).getText().toString().toUpperCase();
                String username = ((EditText) findViewById(R.id.name_edit_text)).getText().toString();
                if (username.equals("") || roomCode.equals("")) {
                    Toast.makeText(getApplicationContext(), "Must provide a room code and username.", Toast.LENGTH_LONG).show();
                } else if (existingRoomCode.contains(roomCode)) {
                    fetchUsers(roomCode, username);
                } else {
                    Toast.makeText(getApplicationContext(), "Room does not exist.", Toast.LENGTH_LONG).show();
                }

            }
        });
    }

    private void fetchUsers(final String roomCode, final String username) {
        existingUsers = new HashSet<>();;

        ValueEventListener userListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for (DataSnapshot code : snapshot.getChildren()) {
                    if (!code.getKey().equals("host")) {
                        for (DataSnapshot user : code.getChildren()) {
                            existingUsers.add(user.getValue().toString());
                        }
                    }
                }
                if (existingUsers.contains(username)) {
                    Toast.makeText(getApplicationContext(), "Username already exists.", Toast.LENGTH_LONG).show();
                } else {
                    enterRoom(roomCode, username);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "getRoomCode:onCancelled", error.toException());
            }
        };
        database.child("players").child(roomCode).addListenerForSingleValueEvent(userListener);
    }

    private void enterRoom(String roomCode, String username) {
        Intent intent = new Intent(JoinGameActivity.this, AssignTeamsActivity.class);

        // Save information in SharedPreferences for other activities to use
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("room_code", roomCode);
        editor.putString("user", username);
        editor.putBoolean("is_host", false);
        editor.commit();

        startActivity(intent);
    }
}