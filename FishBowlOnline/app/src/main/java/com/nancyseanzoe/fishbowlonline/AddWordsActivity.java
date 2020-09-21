package com.nancyseanzoe.fishbowlonline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintSet;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.nancyseanzoe.fishbowlonline.realtimedatabase.model.GameInfo;

import java.util.ArrayList;

import static com.nancyseanzoe.fishbowlonline.SettingsActivity.PREFERENCES;

public class AddWordsActivity extends AppCompatActivity {

    private static final String TAG = "AddWordsActivity";
    private Integer wordsPerPerson;
    private Integer numPlayers;
    private String roomCode;
    private SharedPreferences sharedPreferences;
    private ArrayList<TextInputLayout> textInputLayouts = new ArrayList<>();
    private DatabaseReference db;
    private DatabaseReference wordsRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_words);

        roomCode = getRoomCode();

        db = FirebaseDatabase.getInstance().getReference().child("current_games").child(roomCode);

        db.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                wordsPerPerson = snapshot.child("wordsPerPerson").getValue(Integer.class);
                numPlayers = snapshot.child("numPlayers").getValue(Integer.class);
                configureLayout();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled:", error.toException());
            }
        });

        wordsRef = FirebaseDatabase.getInstance().getReference().child("words").child(roomCode)
                .child("remainingWords");

        wordsRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.getChildrenCount() == (numPlayers * wordsPerPerson)) {
                    db.child("startGame").setValue(true);
                } else {
                    Log.d(TAG, "onDataChange: waiting on more words");
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        });

        db.child("startGame").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                Log.d(TAG, "onDataChange: " + snapshot.getValue(boolean.class));
                if (snapshot.getValue(boolean.class)) {
                    startRoundRuleActivity();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.w(TAG, "onCancelled: ", error.toException());
            }
        });
    }

    private void startRoundRuleActivity() {
        Intent intent = new Intent(this, RoundRule.class);
        startActivity(intent);
    }

    private String getRoomCode() {
        sharedPreferences = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
        return sharedPreferences.getString("room_code", "");
    }

    private void configureLayout() {
        ScrollView addWordsScrollView =
                (ScrollView) getLayoutInflater().inflate(R.layout.activity_add_words, null);
        LinearLayout addWordsLinearLayout = (LinearLayout) addWordsScrollView.getChildAt(0);

        int i;
        for (i = 0; i < wordsPerPerson; i++) {
            LinearLayout linearLayout = (LinearLayout) getLayoutInflater()
                    .inflate(R.layout.material_edit_text_widget, null);
            TextInputLayout textInputLayout = (TextInputLayout) linearLayout.getChildAt(0);
            linearLayout.removeView(textInputLayout);
            textInputLayout.setId(View.generateViewId());
            textInputLayout.setGravity(Gravity.CENTER);
            textInputLayout.setHint(getResources().getString(R.string.word_label, i + 1));
            if (i == 0) {
                textInputLayout.setPadding(0, 64, 0, 0);
            } else {
                textInputLayout.setPadding(0, 32, 0, 0);
            }
            textInputLayouts.add(textInputLayout);
            addWordsLinearLayout.addView(textInputLayout, i + 1);
        }

        final MaterialButton submitButton = new MaterialButton(this);
        submitButton.setId(View.generateViewId());
        submitButton.setText(R.string.submit);
        LinearLayout.LayoutParams params =
                new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 64, 0, 0);
        submitButton.setLayoutParams(params);
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                for (TextInputLayout textInputLayout : textInputLayouts) {
                    if (TextUtils.isEmpty(textInputLayout.getEditText().getText())) {
                        Toast.makeText(getApplicationContext(), "Add all words", Toast.LENGTH_SHORT)
                                .show();
                        return;
                    }
                }
                addWordsToDatabase();
                submitButton.setEnabled(false);
            }
        });
        addWordsLinearLayout.addView(submitButton, i + 1);

        setContentView(addWordsScrollView);
    }

    private void addWordsToDatabase() {
        for (TextInputLayout textInputLayout : textInputLayouts) {
            String word = textInputLayout.getEditText().getText().toString();
            wordsRef.push().setValue(word);
        }
    }

}