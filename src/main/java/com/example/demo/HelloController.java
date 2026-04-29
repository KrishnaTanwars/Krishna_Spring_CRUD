package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Demo application is running. Try /hello or /students";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello Krishna!";
    }
}
