import React, { useState } from "react";
import {
  Container,
  Header,
  Content,
  Form,
  ButtonToolbar,
  Button,
  Navbar,
  Panel,
  FlexboxGrid,
  Radio,
  RadioGroup,
  Whisper,
  Tooltip,
  IconButton,
  Message,
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";
import PageNext from "@rsuite/icons/PageNext";
import ArowBack from "@rsuite/icons/ArowBack";
import CheckOutline from "@rsuite/icons/CheckOutline";

import { UrlValidator } from "./validators";
import { Alert } from "./Alert/Alert";

export const AppForm = () => {
  const [page, setPage] = React.useState(1);

  const [libs, setLibs] = React.useState([]);
  const addField = () => {
    const key = Math.floor(Math.random() * 100000000) + 1;
    setLibs([...libs, key]);
  };
  const deleteField = (index) => {
    const newLibs = [...libs];
    newLibs.splice(index, 1);
    setLibs(newLibs);
  };

  const [form, setForm] = React.useState({
    url: "",
    framework: "Tensorflow",
    command: "",
    userAddress: "",
    machineAddress: "",
    ntx: 0,
  });
  const [libValues, setLibValues] = React.useState({});
  const [errors, setErrors] = React.useState([]);

  const onChangingPage = () => {
    setErrors([]);

    const collectedErrors = [];

    if (form.url.trim().length === 0) {
      collectedErrors.push("Please Enter a URL");
    }
    if (!UrlValidator.test(form.url)) {
      collectedErrors.push("Please Enter a valid URL");
    }
    if (form.command.trim().length === 0) {
      collectedErrors.push("Please Enter a command");
    }

    if (collectedErrors.length > 0) {
      setErrors([...collectedErrors]);
    } else {
      setPage(2);
    }
  };

  const onSubmit = () => {
    setErrors([]);

    const collectedErrors = [];

    if (form.userAddress.trim().length === 0) {
      collectedErrors.push("Please Enter a User Address");
    }

    if (form.machineAddress.trim().length === 0) {
      collectedErrors.push("Please Enter a Machine Address");
    }

    if (form.ntx.toString().trim().length === 0) {
      collectedErrors.push("Please Enter an NTX number");
    }

    if (collectedErrors.length > 0) {
      setErrors([...collectedErrors]);
    } else {
      const data = { ...form };
      const collectedLibraries = [];
      libs.forEach((lib) => {
        if (libValues[lib] !== undefined) {
          collectedLibraries.push(libValues[lib].trim());
        }
      });
      data["libs"] = collectedLibraries.filter(
        (l) => l !== undefined && l.length > 0
      );
      const keys = Object.keys(data);
      keys.forEach((key) => {
        if (typeof data[key] === "string") {
          data[key] = data[key].trim();
        }
      });
      data["ntx"] = parseInt(data["ntx"]);
      console.log(data);
    }
  };

  return (
    <div className="show-fake-browser login-page">
      <Container>
        <Header>
          <Navbar appearance="inverse">
            <Navbar.Brand>
              <span style={{ color: "#fff" }}>ML on GPU</span>
            </Navbar.Brand>
          </Navbar>
        </Header>
        {errors.length > 0 && <Alert text={errors[0]} />}
        {page === 1 ? (
          <Content>
            <FlexboxGrid justify="center" style={{ margin: "2rem 0" }}>
              <FlexboxGrid.Item colspan={12} className="flex-panel-container">
                <Panel
                  style={{ background: "white", padding: "10px" }}
                  className="flex-panel"
                  header={
                    <h4
                      style={{
                        textAlign: "center",
                        fontWeight: "300",
                        marginBottom: "20px",
                      }}
                    >
                      Enter your ML Requirements! 🚀
                      <hr />
                    </h4>
                  }
                  bordered
                  shaded
                >
                  <Form fluid onSubmit={() => onChangingPage()}>
                    <Form.Group>
                      <Form.ControlLabel>
                        Link to ML model ( URL ):
                      </Form.ControlLabel>
                      <Form.Control
                        value={form.url}
                        name="url"
                        onChange={(v) => setForm({ ...form, url: v })}
                      />
                    </Form.Group>

                    <Form.Group
                      name="framework"
                      label="Which framework does it use?"
                    >
                      <Form.ControlLabel>
                        What framework does it use?
                      </Form.ControlLabel>
                      <RadioGroup
                        name="framework"
                        inline
                        value={form.framework}
                        onChange={(v) => setForm({ ...form, framework: v })}
                      >
                        <Radio value={"Tensorflow"}>Tensorflow</Radio>
                        <Radio value={"Pytorch"}>Pytorch</Radio>
                      </RadioGroup>
                    </Form.Group>

                    <Form.Group
                      style={{
                        position: "relative",
                        background: "rgb(245, 245, 245)",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <Form.ControlLabel style={{ marginBottom: "10px" }}>
                        Please enter any additional required depenedencies:{" "}
                        <Whisper
                          trigger="hover"
                          placement="top"
                          speaker={<Tooltip>Add Dependencies</Tooltip>}
                        >
                          <IconButton
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "4px",
                            }}
                            icon={<PlusIcon />}
                            circle
                            onClick={addField}
                          ></IconButton>
                        </Whisper>
                      </Form.ControlLabel>
                      {libs.length > 0 &&
                        libs.map((l, index) => (
                          <div style={{ display: "flex" }} key={l}>
                            <Whisper
                              trigger="hover"
                              placement="top"
                              speaker={<Tooltip>Delete</Tooltip>}
                            >
                              <IconButton
                                style={{ height: "100%", marginTop: "5px" }}
                                icon={<TrashIcon color="red" />}
                                onClick={() => deleteField(index)}
                              />
                            </Whisper>
                            <Form.Control
                              style={{ margin: "5px 0" }}
                              name={`deps${l}`}
                              value={
                                libValues[l] !== undefined ? libValues[l] : ""
                              }
                              onChange={(v) =>
                                setLibValues({ ...libValues, [l]: v })
                              }
                            />
                          </div>
                        ))}
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>
                        Command to run your ML job:
                      </Form.ControlLabel>
                      <Form.Control
                        name="command"
                        autoComplete="off"
                        value={form.command}
                        onChange={(v) => setForm({ ...form, command: v })}
                      />
                    </Form.Group>

                    <Form.Group>
                      <ButtonToolbar className="right">
                        <IconButton
                          icon={<PageNext />}
                          placement="right"
                          appearance="primary"
                          size="lg"
                          type="submit"
                        >
                          Next
                        </IconButton>
                      </ButtonToolbar>
                    </Form.Group>
                  </Form>
                </Panel>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Content>
        ) : (
          <Content>
            <FlexboxGrid justify="center" style={{ margin: "2rem 0" }}>
              <FlexboxGrid.Item colspan={12} className="flex-panel-container">
                <Panel
                  style={{ background: "white", padding: "10px" }}
                  className="flex-panel"
                  header={
                    <h4
                      style={{
                        textAlign: "center",
                        fontWeight: "300",
                        marginBottom: "15px",
                        position: "relative",
                        fontSize: "30px",
                      }}
                    >
                      <Whisper
                        trigger="hover"
                        placement="top"
                        speaker={<Tooltip>Back</Tooltip>}
                      >
                        <IconButton
                          style={{ position: "absolute", left: "10px" }}
                          size="md"
                          onClick={() => setPage(1)}
                          icon={<ArowBack />}
                        />
                      </Whisper>
                      Tokenomics
                      <hr />
                    </h4>
                  }
                  bordered
                  shaded
                >
                  <Form fluid onSubmit={onSubmit}>
                    <Form.Group>
                      <Form.ControlLabel>User Address:</Form.ControlLabel>
                      <Form.Control
                        name="useraddress"
                        value={form.userAddress}
                        onChange={(v) => setForm({ ...form, userAddress: v })}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>
                        Machine Resource Address:
                      </Form.ControlLabel>
                      <Form.Control
                        name="machineaddress"
                        autoComplete="off"
                        value={form.machineAddress}
                        onChange={(v) =>
                          setForm({ ...form, machineAddress: v })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>NTX tokens Number:</Form.ControlLabel>
                      <Form.Control
                        name="ntx"
                        type="number"
                        autoComplete="off"
                        value={form.ntx}
                        onChange={(v) => setForm({ ...form, ntx: v })}
                      />
                    </Form.Group>

                    <Form.Group>
                      <ButtonToolbar>
                        <Button
                          appearance="primary"
                          size="lg"
                          style={{ width: "100%" }}
                          type="submit"
                        >
                          <CheckOutline /> Submit
                        </Button>
                      </ButtonToolbar>
                    </Form.Group>
                  </Form>
                </Panel>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Content>
        )}
      </Container>
    </div>
  );
};
