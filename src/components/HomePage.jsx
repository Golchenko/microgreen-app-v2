import {
  Card,
  Page,
  Layout,
  Tabs
} from "@shopify/polaris";
import { useState, useCallback } from "react";

import ScriptTagWorkers from "../components/scriptTagActivate"
import CustomJsInput from "../components/custom-js-input"
import CustomMessageSection from "../components/custom-message"




export function HomePage() {

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "jsCode",
      content: "Custom JS code",
      panelID: "pannel-0",
    },
    {
      id: "messageSection",
      content: "Message section",
      panelID: "pannel-1",
    },
  ];

  const tabPanels = [
    (
      <Card.Section id="0">
        <ScriptTagWorkers />
        <CustomJsInput />
      </Card.Section>
    ),
    (
      <Card.Section id="1">
        <CustomMessageSection />
      </Card.Section>
    ),
  ];

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <div className="app-wrapper">

            <Card>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                {tabPanels[selected]}
              </Tabs>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
