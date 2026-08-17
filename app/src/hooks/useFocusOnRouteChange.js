import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useFocusOnRouteChange() {
  const location = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, [location.pathname]);
  return ref;
}
