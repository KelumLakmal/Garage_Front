import { useCallback, useEffect } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const useResponseHandler = () => {
  const [responseCode, setResponseCode] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();

  const responseCreator = useCallback(
    (response) => {
      if (!response) {
        const result = {
          code: 0,
          message: "No response from server",
        };
        setResponseCode(result.code);
        setResponseMessage(result.message);
        return result;
      }
      const code = response.status;
      const message = response.data || "Unknown response";

      // setResponseCode(code);
      let finalMessage = "";

      switch (code) {
        case 200:
          finalMessage = "Ok";
          break;
        case 201:
          finalMessage = "Successfully Created";
          break;
        case 204:
          finalMessage = "No Content";
          break;
        case 400:
          finalMessage = message;
          break;
        case 401:
          finalMessage = "Unauthorized";
          navigate("/", { replace: true });
          break;
        case 404:
          finalMessage = message;
          break;
        default:
          finalMessage = message;
          break;
      }
      setResponseCode(code);
      setResponseMessage(finalMessage);

      return { code, message: finalMessage };
    },
    [navigate]
  );

  return {
    responseCode,
    responseMessage,
    responseCreator,
  };
};
export default useResponseHandler;
