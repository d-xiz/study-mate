import { tutorsApi } from "./tutors";
import { groupsApi } from "./groups";
import { authApi } from "./auth";
import { homeApi } from "./home";
import { notificationsApi } from "./notifications";
import { usersApi } from "./users";
import { sessionsApi } from "./sessions";

export const api = {
  tutors: tutorsApi,
  groups: groupsApi,
  auth: authApi,
  home: homeApi,
  notifications: notificationsApi,
  users: usersApi,
  sessions: sessionsApi,
};
