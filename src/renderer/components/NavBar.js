import React from "react";
import PathIndicator from "./PathIndicator";
import NavBarIcons from "./NavBarIcons";

export default function NavBar(props) {
    return (
        <span className="navBar">
            <PathIndicator path={props.path} />
            <NavBarIcons onActionClick={props.onActionClick} />
        </span>
    );
}
