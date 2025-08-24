import { useChat } from "@/context/ChatContext";
import { getValueInLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";

const useNewMessage = () => {
  const [isNewMessage, setIsNewMessage] = useState(false);
  const { state } = useChat();

  useEffect(() => {
    const isNewMessage = getValueInLocalStorage("is_new_message");
    if (isNewMessage) {
      setIsNewMessage(true);
      localStorage.removeItem("is_new_message");
    }
  }, [state]);

  return isNewMessage;
};

export default useNewMessage;
