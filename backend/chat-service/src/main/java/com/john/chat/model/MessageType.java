package com.john.chat.model;

public enum MessageType {
    NEW, EDIT, DELETE;

    public static MessageType from(String value) {
        try {
            return MessageType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return NEW;
        }
    }
}