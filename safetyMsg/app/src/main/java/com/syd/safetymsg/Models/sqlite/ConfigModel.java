package com.syd.safetymsg.Models.sqlite;

import com.litesuits.orm.db.annotation.PrimaryKey;
import com.litesuits.orm.db.enums.AssignType;

/**
 * Created by east on 2017/4/18.
 */

public class ConfigModel {

    @PrimaryKey(AssignType.AUTO_INCREMENT)
    private int Id;

    public String getToken() {
        return Token;
    }

    public void setToken(String token) {
        Token = token;
    }

    private String Token;
}
