package com.nancyseanzoe.fishbowlonline;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

         findViewById(R.id.new_game_btn).setOnClickListener(new View.OnClickListener() {
          public void onClick(View v) {
              Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
              startActivity(intent);
          }
        });

        findViewById(R.id.join_game_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            Intent intent = new Intent(MainActivity.this, JoinGameActivity.class);
            startActivity(intent);
            }
        });
    }

}