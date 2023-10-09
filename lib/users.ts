import { Setting, User } from "../types/interfaces";
import { getSettingsFromStore, writeSettingToStore } from "./localStore";
import Router from "next/router";

export function verifyUser() {
  const local = getSettingsFromStore("user");
  const user = JSON.parse(local as string);

  if (user == undefined || local == -1) return null;

  return user as User
}

export async function loginUser(user: Setting) {
  return fetch("/api/getUser", {
    method: "POST",
    body: JSON.stringify({ email: user["email"], password: user["password"] }),
  })
    .then((res) => res.json())
    .then(async (json) => {
      const matchingUser = {email: json["email"], permissionLevel: json["permission_level"]} as User;

      writeSettingToStore("user", JSON.stringify(matchingUser));
      return matchingUser;
    })
    .catch(err => {
      return null;
    });
} 

export function logoutUser() {
  writeSettingToStore("user", "");
  Router.push("/");
}