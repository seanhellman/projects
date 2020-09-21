package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.TeamsInfo;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class SettingsActivity extends AppCompatActivity {
    private static final String TAG = "SETTINGS";

    private final int DEFAULT_WORDS_PER_PERSON = 3;
    private final int ROOM_CODE_LENGTH = 5;
    protected static final String PREFERENCES = "GAME_INFO";

    private SharedPreferences sharedPreferences;
    private DatabaseReference database;
    private GameInfo gameInfo;
    private String roomCode;
    private Set<String> existingRoomCode;

    private EditText hostName;
    private TextView numRoundText;
    private TextView timeText;
    private ImageView roundNumIcon;
    private ImageView timeIcon;
    private ImageView wordIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);

        database = FirebaseDatabase.getInstance().getReference();
        int defaultNumRounds = Integer.parseInt(this.getResources().getString(R.string.default_num_rounds));
        int defaultTime = Integer.parseInt(this.getResources().getString(R.string.default_time));
        gameInfo = new GameInfo(defaultNumRounds, defaultTime, DEFAULT_WORDS_PER_PERSON);

        // Generate room code
        createRoomCodeListener();

        final Spinner numWordsSpinner = (Spinner) findViewById(R.id.num_words_spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.num_words_array, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        numWordsSpinner.setAdapter(adapter);
        numWordsSpinner.setSelection(DEFAULT_WORDS_PER_PERSON - 1);

        initViews();
        createNumRoundsListener();
        createTimeListener();

        findViewById(R.id.get_room_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            String username = hostName.getText().toString();
            if (!username.equals("")) {
                Intent intent = new Intent(SettingsActivity.this, AssignTeamsActivity.class);
                gameInfo.setWordsPerPerson(Integer.parseInt(numWordsSpinner.getSelectedItem().toString()));

                // Update database with initial values
                database.child("current_games").child(roomCode).setValue(gameInfo);
                database.child("players").child(roomCode).child("host").setValue(username);
                database.child("timers").child(roomCode).setValue(gameInfo.getTimePerPerson()*1000);
                database.child("current_clue_givers").child(roomCode).setValue(new TeamsInfo(1, 1));
                database.child("scores").child(roomCode).setValue(new TeamsInfo(0, 0));

                // Update SharedPreferences with room code to be access by other activities
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("room_code", roomCode);
                editor.putString("user", username);
                editor.putBoolean("is_host", true);
                editor.commit();

                startActivity(intent);
            } else {
                Toast.makeText(getApplicationContext(), "Must provide a name for the host.", Toast.LENGTH_LONG).show();
            }
            }
        });
    }

    private void initViews() {
        hostName = (EditText) findViewById(R.id.host_name_edit_text);
        numRoundText = (TextView) findViewById(R.id.current_num_rounds_text);
        timeText = (TextView) findViewById(R.id.current_time_text);
        roundNumIcon = (ImageView) findViewById(R.id.num_rounds_icon);
        timeIcon = (ImageView) findViewById(R.id.time_icon);
        wordIcon = (ImageView) findViewById(R.id.num_words_icon);

    }

    public void handleIconOnClick(View view) {
        Intent intent = new Intent(this, SettingsDescriptionActivity.class);
        intent.putExtra("id", view.getId());
        startActivity(intent);
    }

    private void createNumRoundsListener() {
        ((SeekBar) findViewById(R.id.num_rounds_seek_bar)).setOnSeekBarChangeListener(
            new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    gameInfo.setNumRounds(progress);
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                    // do nothing
                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    numRoundText.setText(gameInfo.getNumRounds() + "");
                }
            }
        );
    }

    private void createTimeListener() {
        ((SeekBar) findViewById(R.id.time_seek_bar)).setOnSeekBarChangeListener(
            new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    gameInfo.setTimePerPerson(progress);
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                    // do nothing
                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    timeText.setText(gameInfo.getTimePerPerson() + "");
                }
        });
    }

    public void createRoomCode(int length){
        final String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for(int i = 0; i < length; i++){
            sb.append(str.charAt(random.nextInt(36)));
        }
        while(existingRoomCode.contains(sb.toString())){
            sb.delete(0, sb.length());
            for(int i = 0; i < length; i++){
                sb.append(str.charAt(random.nextInt(36)));
            }
        }
        roomCode = sb.toString();
    }

    private void createRoomCodeListener(){
        existingRoomCode = new HashSet<>();
        ValueEventListener roomCodeListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for(DataSnapshot code : snapshot.getChildren()){
                    Log.w(TAG, "room code" + code.getKey());
                    existingRoomCode.add(code.getKey());
                }
                createRoomCode(ROOM_CODE_LENGTH);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "getRoomCode:onCancelled", error.toException());
            }
        };
        database.child("current_games").addValueEventListener(roomCodeListener);
    }
}