import React, { useState } from "react";
import CryptoJS from "crypto-js";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../../redux/actions";

//Components
import { Button, Text, Image, Box } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import "./home.scss";
import DragAndDrop from "../../components/dragAndDrop/dragAndDrop";
import i18n from "../../imports/i18n";

import { usePlatformDetector } from "../../imports/utils";

// versioning
import { VERSION } from "../../imports/config";

let url = "/images/logo-bcode-bianco.png",
    link = "https://bcode.cloud",
    heightPowered = "40px",
    marginPowered = "10px";

function Home(props) {
    const { theme, changeTheme } = props;

    const [fileName, setFileName] = useState(false);
    const [fileHash, setFileHash] = useState(false);

    const selectTheme = () => {
        changeTheme(theme === "light" ? "dark" : "light");
    };

    const loadFile = async file => {
        let reader = new FileReader();

        reader.onload = function(event) {
            const wordArray = CryptoJS.lib.WordArray.create(
                event.target.result,
            );

            setFileHash(CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex));
        };

        reader.readAsArrayBuffer(file);

        setFileName(file.name);
    };

    const platform = usePlatformDetector();

    const boxStyle = {
        display: "flex",
        alignItems: "center",
    };

    return (
        <Box className="home" bg={`${theme}.bg`}>
            <Box bg={`${theme}.topbar`} className={"topbar"}>
                <Text
                    color={`${theme}.logo`}
                    className={"title"}
                    onClick={() => {
                        window.open("https://bcode.cloud");
                    }}
                >
                    Pablock
                </Text>
                {theme === "light" ? (
                    <MoonIcon
                        w={6}
                        h={6}
                        color={`${theme}.colorSelector`}
                        onClick={selectTheme}
                    />
                ) : (
                    <SunIcon
                        w={6}
                        h={6}
                        color={`${theme}.colorSelector`}
                        onClick={selectTheme}
                    />
                )}
            </Box>

            {!fileName ? (
                <Box className={"mainarea"}>
                    <Text
                        color={`${theme}.text`}
                        // backgroundColor={`${theme}.textBg`}
                        className={"text"}
                    >
                        {i18n.t("calculate_hash")}
                    </Text>
                    <DragAndDrop
                        onChange={file => {
                            loadFile(file[0]);
                        }}
                        backgroundColor={`${theme}.draganddrop`}
                    />
                    <Text color={`${theme}.text`}>{i18n.t("or")}</Text>
                    <Button bg={`${theme}.logo`} size="lg">
                        <label>
                            {i18n.t("import_file")}
                            <input
                                style={{ display: "none" }}
                                type="file"
                                onChange={e => {
                                    loadFile(e.target.files[0]);
                                }}
                            />
                        </label>
                    </Button>
                </Box>
            ) : (
                <Box className={"mainarea hash"}>
                    <Box
                        color={`${theme}.text`}
                        backgroundColor={`${theme}.textBg`}
                        className={"text"}
                        fontSize={
                            platform === "isDesktop"
                                ? "20px"
                                : "isTablet"
                                ? "16px"
                                : "14px"
                        }
                    >
                        <Text fontWeight={"bold"}>{`${i18n.t(
                            "file_name",
                        )}`}</Text>
                        <Text> {fileName}</Text>
                    </Box>
                    <Box
                        color={`${theme}.text`}
                        backgroundColor={`${theme}.textBg`}
                        className={"text"}
                        fontSize={
                            platform === "isDesktop"
                                ? "20px"
                                : "isTablet"
                                ? "16px"
                                : "14px"
                        }
                        wordBreak={
                            platform === "isMobile" ? "break-all" : "unset"
                        }
                    >
                        <Text fontWeight={"bold"}>{`${i18n.t("hash")}`}</Text>
                        <Text>{fileHash}</Text>
                    </Box>
                    <Button
                        bg={`${theme}.logo`}
                        size="lg"
                        onClick={() => {
                            setFileHash(false);
                            setFileName(false);
                        }}
                        margin={"20px"}
                    >
                        {i18n.t("calculate_new_hash")}
                    </Button>
                </Box>
            )}

            <Box
                className={"footer"}
                height={platform === "isDesktop" ? "75px" : "50px"}
            >
                <Box
                    className={"in"}
                    backgroundColor={`${theme}.topbar`}
                    width={platform === "isDesktop" ? "80%" : "100%"}
                    borderTopLeftRadius={
                        platform === "isDesktop" ? "10px" : "0"
                    }
                    borderTopRightRadius={
                        platform === "isDesktop" ? "10px" : "0"
                    }
                    justifyContent={
                        platform === "isDesktop" ? "space-between" : "center"
                    }
                >
                    {platform !== "isMobile" && (
                        <Box style={{ ...boxStyle, color: "white" }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginRight: 5,
                                    color: "#ffffff",
                                }}
                            >
                                {i18n.t("footer_version")}
                            </Text>
                            <Text style={{ fontSize: 16, color: "#ffffff" }}>
                                {VERSION}
                            </Text>
                        </Box>
                    )}
                    <Box>
                        <a href={link} target="_blank" rel="noreferrer">
                            <Box style={boxStyle}>
                                <Text color={`${theme}.logo`}>Powered by </Text>
                                <Image
                                    src={url}
                                    h={
                                        platform === "isDesktop"
                                            ? "40px"
                                            : "25px"
                                    }
                                    marginLeft={marginPowered}
                                />
                            </Box>
                        </a>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(({ user }) => {
    return { theme: user.theme };
}, mapDispatchToProps)(Home);
