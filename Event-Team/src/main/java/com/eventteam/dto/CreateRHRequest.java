package com.eventteam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRHRequest {
    private String name;
    private String email;
    private String password;
}
