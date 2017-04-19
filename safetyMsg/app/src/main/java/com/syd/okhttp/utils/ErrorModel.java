package com.syd.okhttp.utils;

/**
 * Created by east on 2017/4/18.
 */

public class ErrorModel{
    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    private String exceptionMessage;
}