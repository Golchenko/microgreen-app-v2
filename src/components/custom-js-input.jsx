import { Card, Button, TextField } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

export default function CustomJsInput() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    const [value, setValue] = useState("Updating...");

    const handleChange = useCallback((newValue) => setValue(newValue), []);

    const saveCode = async () => {
        const data = encodeURIComponent(value)
        console.log(data);
        const res = await fetch("/write-code", {
            headers: {
                data: data,
            },
        });
        const saveCode = await res.text();
        console.log(saveCode);
    }


    const getCode = useCallback(async () => {
        const response = await fetch("/update-code")
            .then((response) => {
                return response.text();
            }).then((data) => {
                return data
            });

        setValue(response);
    }, []);

    useEffect(() => {
        getCode();
    }, []);

    return (
        <div className="js-input">
            <Card.Section title="Custom JS">
                <TextField
                    label="Enter custom java script code"
                    value={value}
                    onChange={handleChange}
                    multiline={10}
                    autoComplete="off"
                />
                <Button
                    primary
                    onClick={() => { saveCode() }}
                >
                    Save changes
                </Button>

            </Card.Section>
        </div>


    )
}


{/* <Card.Section title="Product tags">
                <p>Enter product tags for which the section will be displayed.</p>
                <input
                  className="Polaris-TextField__Input"
                  onChange={(event) => { setProductTags(event.target.value) }}
                  placeholder="Example: tag1, tag2, tag3"
                />
              </Card.Section>
              <Card.Section title="Message limit">
                <p>Maximum message length</p>
                <input
                  className="Polaris-TextField__Input"
                  onChange={(event) => { setMessageLimit(event.target.value) }}
                  placeholder="Default: 300"
                />
              </Card.Section> */}