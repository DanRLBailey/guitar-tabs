import InputComponent from "../components/containers/inputComponent";
import { getSettingsFromStore } from "../lib/localStore";
import styles from "../styles/Index.module.scss";
import { useEffect, useState } from "react";
import { Setting, User } from "../types/interfaces";
import { loginUser, verifyUser } from "../lib/users";
import Router from "next/router";
import { Url } from "url";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({
    email: "",
    permissionLevel: "none",
  });
  const [tempUser, setTempUser] = useState<Setting>({
    email: "",
    password: "",
  });

  const login = async () => {
    if (tempUser["email"] == "" || tempUser["password"] == "") return;

    const login = await loginUser(tempUser);
    console.log("login", login);

    if (login == null) {
      console.log("not corrext");
      return;
    }

    setUser(login as User);
  };

  const loginAsGuest = async () => {
    setUser({
      email: "guest",
      permissionLevel: "user",
    } as User);

    setLoading(false);
  };

  useEffect(() => {
    if (!loading) return;
    const localUser = verifyUser();

    if (!localUser) {
      setLoading(false);
      return;
    }

    setUser({
      email: localUser.email,
      permissionLevel: localUser.permissionLevel,
    } as User);

    setLoading(false);
  });

  useEffect(() => {
    if (user.email == "" || user.permissionLevel == "none") return;

    const routerPath = { pathname: `/home` } as Url;

    Router.push(routerPath);
  }, [user]);

  const title = (title?: string) => (
    <title>Guitar Tabs{title ? ` - ${title}` : ""}</title>
  );

  if (loading)
    return (
      <>
        {title()}
        <span>Loading...</span>
      </>
    );

  if (user.email == "" || user.permissionLevel == "none")
    return (
      <div className={styles.container}>
        {title("Login")}
        <InputComponent
          type="string"
          value={tempUser["email"] as string}
          onValueChange={(e) =>
            setTempUser({ ...tempUser, email: e.target.value })
          }
          heading="Email"
        />
        <InputComponent
          type="string"
          value={tempUser["password"] as string}
          onValueChange={(e) =>
            setTempUser({ ...tempUser, password: e.target.value })
          }
          heading="Password"
        />
        <div className={styles.buttonContainer}>
          <button onClick={login}>Login</button>
          <button onClick={loginAsGuest}>Use as Guest</button>
        </div>
      </div>
    );
}
