package com.xiojuandawt.blood4life.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.stereotype.Service;

@Service
public class LdapService {

    @Autowired
    private LdapTemplate ldapTemplate;

    public boolean authenticate(String username, String password) {
        try {
            // Extract UID from email if it contains @, otherwise use as-is
            String uid = username.contains("@") ? username.split("@")[0] : username;

            // Authenticate using 'uid' attribute which is the primary identifier in LDAP
            EqualsFilter filter = new EqualsFilter("uid", uid);
            return ldapTemplate.authenticate("", filter.toString(), password);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void createUser(String username, String password, String commonName, String surname) {
        try {
            javax.naming.Name dn = org.springframework.ldap.support.LdapNameBuilder
                    .newInstance()
                    .add("ou", "empleados")
                    .add("uid", username)
                    .build();

            javax.naming.directory.Attributes attributes = new javax.naming.directory.BasicAttributes();
            javax.naming.directory.BasicAttribute objectClass = new javax.naming.directory.BasicAttribute(
                    "objectClass");
            objectClass.add("top");
            objectClass.add("person");
            objectClass.add("organizationalPerson");
            objectClass.add("inetOrgPerson");
            attributes.put(objectClass);

            attributes.put("cn", commonName);
            attributes.put("sn", surname);
            attributes.put("uid", username);
            attributes.put("userPassword", password);

            ldapTemplate.bind(dn, null, attributes);
            System.out.println("LDAP: Created user " + username);
        } catch (Exception e) {
            System.err.println("LDAP: Error creating user " + username);
            e.printStackTrace();
        }
    }

    public void createGroup(String groupName) {
        try {
            javax.naming.Name dn = org.springframework.ldap.support.LdapNameBuilder
                    .newInstance()
                    .add("ou", "grupos")
                    .add("cn", groupName)
                    .build();

            javax.naming.directory.Attributes attributes = new javax.naming.directory.BasicAttributes();
            javax.naming.directory.BasicAttribute objectClass = new javax.naming.directory.BasicAttribute(
                    "objectClass");
            objectClass.add("top");
            objectClass.add("groupOfNames");
            attributes.put(objectClass);

            attributes.put("cn", groupName);

            ldapTemplate.bind(dn, null, attributes);
            System.out.println("LDAP: Created group " + groupName);
        } catch (Exception e) {
            System.err.println("LDAP: Error creating group " + groupName);
            e.printStackTrace();
        }
    }

    public void addUserToGroup(String username, String groupName) {
        try {
            javax.naming.Name groupDn = org.springframework.ldap.support.LdapNameBuilder
                    .newInstance()
                    .add("ou", "grupos")
                    .add("cn", groupName)
                    .build();

            javax.naming.Name userDn = org.springframework.ldap.support.LdapNameBuilder
                    .newInstance()
                    .add("ou", "empleados")
                    .add("uid", username)
                    .build();

            javax.naming.directory.ModificationItem[] mods = new javax.naming.directory.ModificationItem[1];
            javax.naming.directory.Attribute attribute = new javax.naming.directory.BasicAttribute("member",
                    userDn.toString());
            mods[0] = new javax.naming.directory.ModificationItem(javax.naming.directory.DirContext.ADD_ATTRIBUTE,
                    attribute);

            ldapTemplate.modifyAttributes(groupDn, mods);
            System.out.println("LDAP: Added user " + username + " to group " + groupName);
        } catch (Exception e) {
            System.err.println("LDAP: Error adding user to group");
            e.printStackTrace();
        }
    }
}
