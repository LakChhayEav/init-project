package com.example.taskapp.config;

import com.example.taskapp.model.User;
import com.example.taskapp.model.Task;
import com.example.taskapp.model.Role;
import com.example.taskapp.model.Permission;

public class ApiDocs {
    public static class UsersDoc extends User { }
    public static class TasksDoc extends Task { }
    public static class RolesDoc extends Role { }
    public static class PermissionsDoc extends Permission { }
}
