package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.services.LdapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ldap")
public class LdapManagementController {

    @Autowired
    private LdapService ldapService;

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestParam String username,
            @RequestParam String password,
            @RequestParam String commonName,
            @RequestParam String surname) {
        try {
            ldapService.createUser(username, password, commonName, surname);
            return ResponseEntity.ok(Map.of("message", "User created successfully in LDAP: " + username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/groups")
    public ResponseEntity<?> createGroup(@RequestParam String groupName) {
        try {
            ldapService.createGroup(groupName);
            return ResponseEntity.ok(Map.of("message", "Group created successfully in LDAP: " + groupName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/groups/{groupName}/members")
    public ResponseEntity<?> addUserToGroup(@PathVariable String groupName, @RequestParam String username) {
        try {
            ldapService.addUserToGroup(username, groupName);
            return ResponseEntity.ok(Map.of("message", "User " + username + " added to group " + groupName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
