package com.nancyseanzoe.fishbowlonline;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

import org.w3c.dom.Text;

public class SettingsDescriptionActivity extends AppCompatActivity {

    private int settingID;
    private TextView settingTitle;
    private TextView settingDescription;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings_description);

        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);

        settingID = getIntent().getIntExtra("id", 0);
        settingTitle = (TextView) findViewById(R.id.current_settings_text);
        settingDescription = (TextView) findViewById(R.id.setting_description);

        switch (settingID) {
            case R.id.num_rounds_icon :
                settingTitle.setText(R.string.num_rounds);
                settingDescription.setText(R.string.num_rounds_des);
                break;
            case R.id.time_icon :
                settingTitle.setText(R.string.time_round);
                settingDescription.setText(R.string.time_round_des);
                break;
            case R.id.num_words_icon :
                settingTitle.setText(R.string.num_word_person);
                settingDescription.setText(R.string.num_rounds_des);
                break;
            default :
                break;
        }
    }
}