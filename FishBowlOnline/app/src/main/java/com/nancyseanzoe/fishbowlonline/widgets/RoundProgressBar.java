package com.nancyseanzoe.fishbowlonline.widgets;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

import com.nancyseanzoe.fishbowlonline.R;

/**
 * Code citations:
 * Android Round Loading Bar Design Guide: https://blog.csdn.net/ahuyangdong/article/details/79942824
 */
public class RoundProgressBar extends View {

    private Paint paint;
    private int roundColor;
    private float roundWidth;
    private int progressColor;
    private float progressWidth;
    private String text;
    private int textColor;
    private float numSize;
    private int progress;
    private int progressMax;
    private int progressStartAngle;


    public RoundProgressBar(Context context) {
        this(context, null);
    }

    public RoundProgressBar(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public RoundProgressBar(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        paint = new Paint();

        TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.RoundProgressBar);

        roundColor = typedArray.getColor(R.styleable.RoundProgressBar_roundColor, Color.GRAY);
        roundWidth = typedArray.getDimension(R.styleable.RoundProgressBar_roundWidth, 5);
        progressColor = typedArray.getColor(R.styleable.RoundProgressBar_progressColor, Color.RED);
        progressWidth = typedArray.getDimension(R.styleable.RoundProgressBar_progressWidth, roundWidth);
        text = typedArray.getString(R.styleable.RoundProgressBar_textContent);
        textColor = typedArray.getColor(R.styleable.RoundProgressBar_textColor, Color.RED);
        numSize = typedArray.getDimension(R.styleable.RoundProgressBar_numSize, 22);
        progressMax = typedArray.getInt(R.styleable.RoundProgressBar_progressMax, 100);
        progressStartAngle = typedArray.getInt(R.styleable.RoundProgressBar_progressStartAngle, 270);
        typedArray.recycle();

    }

    @Override
    protected void onDraw(Canvas canvas){
        super.onDraw(canvas);

        int centerX = getWidth() / 2;
        int radius = (int) (centerX - roundWidth / 2);

        // draw the outer circle
        paint.setStrokeWidth(roundWidth);
        paint.setColor(roundColor);
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawCircle(centerX, centerX, radius, paint);

        // draw the inner circle
        paint.setStrokeWidth(progressWidth);
        paint.setColor(progressColor);
        RectF oval = new RectF(centerX - radius, centerX - radius, centerX + radius, centerX + radius);
        int sweepAngle = 360 * progress / progressMax;
        canvas.drawArc(oval, progressStartAngle, sweepAngle, false, paint);

        // draw the text inside the circle
        paint.setStrokeWidth(8);
        paint.setColor(textColor);
        paint.setTextSize(numSize);
        paint.setTypeface(Typeface.SANS_SERIF);
        String output = formatTime(progress);
        float numWidth = paint.measureText(output);
        canvas.drawText(output, centerX - numWidth / 2, centerX + roundWidth, paint);
    }

    public synchronized int getProgress(){
        return progress;
    }

    public synchronized void setProgress(int progress){
        if(progress < 0){
            throw new IllegalArgumentException("progress cannot be less than 0");
        }
        if(progress > progressMax){
            progress = progressMax;
        }

        this.progress = progress;
        postInvalidate();
    }

    public synchronized void setProgressMax(int progressMax){
        this.progressMax = progressMax;
        postInvalidate();
    }

    private String formatTime(int progress){
        int minute;
        int second;
        minute = (int) (progress / 1000 / 60);
        second = (int) (progress / 1000 % 60);

        if (minute < 10) {
            if (second < 10) {
                return "0" + minute + " : " + "0" + second;
            } else {
                return "0" + minute + " : " + second;
            }
        }else {
            if (second < 10) {
                return minute + " : " + "0" + second;
            } else {
                return minute + " : " + second;
            }
        }
    }

}
