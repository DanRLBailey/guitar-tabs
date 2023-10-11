import styles from "../styles/NavBar.module.scss";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";

interface NavBarProp {
  children?: React.ReactElement;
  className?: string;
}

export default function NavBar(props: NavBarProp) {
  return (
    <div className={`${styles.navBarContainer} ${props.className}`}>
      <Link href="/">
        <HomeIcon />
      </Link>
      <div className={styles.childrenContainer}>{props.children}</div>
    </div>
  );
}
