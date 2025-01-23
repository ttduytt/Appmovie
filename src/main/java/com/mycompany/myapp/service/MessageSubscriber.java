package com.mycompany.myapp.service;

import org.springframework.stereotype.Service;

@Service
public class MessageSubscriber {

    public void receiverMessage(String message) {
        System.out.println("movie receive:" + message);
    }

    public void receiverMessageactor(String message) {
        System.out.println("actor receive:" + message);
    }
}
