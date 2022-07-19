import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Card, Frame, Loading } from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";

function ScriptTagWorkers() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [installedScripts, setInstalledScripts] = useState("");

  const SCRIPT_TAG_URL = `https://microgreen-app.herokuapp.com/src/script/AppScript.js`;

  // CHECK EXISTING SCRIPT TAGS //

  const CHECK_SCRIPT_TAG = gql`
      query {
        scriptTags(first: 50, src: "${SCRIPT_TAG_URL}" ) {
          edges {
            node {
              id
              src
            }
          }
        }
      }
    `
    ;

  const { loading: checkScriptLoading, error: checkScriptError, data: checkScriptData } = useQuery(CHECK_SCRIPT_TAG, {
    onCompleted(checkScriptData) {
      console.log("CHECKED: ", checkScriptData);
      checkScriptData.scriptTags.edges.map(scriptTag => {
        setInstalledScripts(scriptTag.node.id)

        if (checkScriptData.scriptTags.edges[0].node.src == SCRIPT_TAG_URL && !isInstalled) {
          setIsInstalled(true)
          console.log("+");
        }
        if (checkScriptData.scriptTags.edges[0].node.src == SCRIPT_TAG_URL && isInstalled) {
          setIsInstalled(false)
          console.log("-");
        }
      })
    },
    onError() {
      setIsError(true)
      console.log(checkScriptError.message);
    }
  });

  (checkScriptLoading && !isChecking) ? setIsChecking(true) : null;
  (!checkScriptLoading && isChecking) ? setIsChecking(false) : null;


  // CREATE NEW SCRIPT TAG  //

  const CREATE_SCRIPTTAG_QUERY = gql`
      mutation {
        scriptTagCreate(
          input: {
            cache: false
            displayScope: ALL
            src: "${SCRIPT_TAG_URL}"
          }
        ) {
          scriptTag {
            id
            src
            displayScope
          }
        }
      }
    `;

  const [createScript, { loading: createScriptLoading, error: createScriptError, data: createScriptData }] = useMutation(
    CREATE_SCRIPTTAG_QUERY, {
    onCompleted(createScriptData) {
      console.log("CREATED: ", createScriptData);
      setIsInstalled(true)
    },
    onError() {
      setIsError(true)
    }
  }
  );

  (createScriptLoading && !isLoading) ? setIsLoading(true) : null;
  (!createScriptLoading && isLoading) ? setIsLoading(false) : null;

  // DELETE EXISTING SCRIPT TAG //

  const DELETE_SCRIPTTAG_QUERY = gql`
      mutation ScriptTagDelete {
        scriptTagDelete(id: "${installedScripts}") {
          deletedScriptTagId
          userErrors {
            field
            message
          }
        }
      }
    `;
  const [deleteScript, { loading: deleteScriptLoading, error: deleteScriptError, data: deleteScriptData }] = useMutation(
    DELETE_SCRIPTTAG_QUERY, {
    onCompleted(deleteScriptData) {
      console.log("onCompleted(data)", deleteScriptData);
      setIsInstalled(false)
    },
    onError() {
      setIsError(true)
    }
  }
  );

  (deleteScriptLoading && !isDeleting) ? setIsDeleting(true) : null;
  (!deleteScriptLoading && isDeleting) ? setIsDeleting(false) : null;

  // TOAST ERROR TEMPLATE //

  const toastError = (isError) ? (
    <Toast
      error
      content={`Something goes wrong...`}
      onDismiss={() => { }}
    />
  ) : null;

  const loadingTemplate = (isChecking) ? (
    <div style={{ height: "0px" }}>
      <Frame>
        <Loading />
      </Frame>
    </div>
  ) : null;

  return (
    <>
      {loadingTemplate}
      {toastError}
      <Card
        title="Activate app"
        primaryFooterAction={{
          content: "Install Script Tag",
          onAction: () => { createScript() },
          loading: ((isLoading && !isChecking) || (!isLoading && isChecking)) ? true : false,
          disabled: isInstalled,
        }}
        secondaryFooterActions={[
          {
            content: "Remove Script Tag",
            onAction: () => { deleteScript() },
            destructive: true,
            loading: isDeleting,
            disabled: !isInstalled,
          },
        ]}
      ></Card>
    </>
  );
}

export default ScriptTagWorkers
